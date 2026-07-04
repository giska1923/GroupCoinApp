import React, { useMemo, useState } from 'react';
import { Alert, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useAuthStore } from '../../stores/auth.store';
import { useSimplifiedTransfers } from '../../hooks/useBalances';
import { useGroupMembers } from '../../hooks/useGroup';
import { useCreateSettlement } from '../../hooks/useSettlements';
import { ClientError } from '../../api/errors';
import type { GroupMemberDTO, SimplifiedTransferDTO } from '../../types/api';
import { resolveMemberDisplayName } from '../../utils/memberDisplay';
import { Column } from '../layout/Row';
import { Typography, Amount, Button } from '../ui';
import { Spinner, ErrorState, EmptyState } from '../feedback';
import { isZeroAmount } from '../../utils/money';
import { isSupportedCurrency } from '../../config/currency';

interface SettleUpListProps {
  groupId: string;
}

const transferCopy = (
  transfer: SimplifiedTransferDTO,
  currentUserId: string,
  members: GroupMemberDTO[] | undefined,
): string => {
  if (String(transfer.fromUserId) === String(currentUserId)) {
    const to = resolveMemberDisplayName(transfer.toUserId, {
      currentUserId,
      members,
    });
    return `You owe ${to}`;
  }
  const from = resolveMemberDisplayName(transfer.fromUserId, {
    currentUserId,
    members,
  });
  return `${from} owes you`;
};

const transferKey = (transfer: SimplifiedTransferDTO): string =>
  `${transfer.fromUserId}-${transfer.toUserId}-${transfer.currency}`;

export const SettleUpList: React.FC<SettleUpListProps> = ({ groupId }) => {
  const theme = useTheme();
  const currentUserId = useAuthStore(s => s.user?.id);
  const transfers = useSimplifiedTransfers(groupId);
  const members = useGroupMembers(groupId);
  const createSettlement = useCreateSettlement(groupId);
  const [settlingKey, setSettlingKey] = useState<string | null>(null);

  const settleTransfer = (transfer: SimplifiedTransferDTO) => {
    if (!currentUserId) return;
    const copy = transferCopy(transfer, currentUserId, members.data);

    Alert.alert(
      'Record settlement?',
      `${copy} ${transfer.currency} ${transfer.amount}. This marks the debt as paid.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Settle',
          onPress: () => {
            setSettlingKey(transferKey(transfer));
            createSettlement.mutate(
              {
                fromUserId: transfer.fromUserId,
                toUserId: transfer.toUserId,
                amount: transfer.amount,
                currency: transfer.currency,
              },
              {
                onSettled: () => setSettlingKey(null),
                onError: error =>
                  Alert.alert(
                    'Could not record settlement',
                    error instanceof ClientError
                      ? error.message
                      : 'Please try again.',
                  ),
              },
            );
          },
        },
      ],
    );
  };

  const mine = useMemo(() => {
    if (!currentUserId || !transfers.data) return [];
    return transfers.data.filter(
      t =>
        isSupportedCurrency(t.currency) &&
        (String(t.fromUserId) === String(currentUserId) ||
          String(t.toUserId) === String(currentUserId)),
    );
  }, [transfers.data, currentUserId]);

  if (!currentUserId) {
    return (
      <Typography variant='body' color='secondary' align='center'>
        Sign in to see settle-up suggestions.
      </Typography>
    );
  }

  if (transfers.isLoading || members.isLoading) {
    return <Spinner size='small' />;
  }

  if (transfers.isError && !transfers.data) {
    return (
      <ErrorState error={transfers.error} onRetry={() => transfers.refetch()} />
    );
  }

  if (mine.length === 0 || mine.every(t => isZeroAmount(t.amount))) {
    return (
      <EmptyState
        title='All settled up'
        message='No payments needed — everyone is even in this group.'
      />
    );
  }

  return (
    <Column gap='md'>
      <Typography variant='caption' color='secondary'>
        Pay these to settle everyone up:
      </Typography>
      {mine.map((transfer, index) => {
        const key = transferKey(transfer);
        return (
          <View
            key={`${key}-${index}`}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: theme.spacing.md,
              paddingVertical: theme.spacing.sm,
              borderBottomWidth: index < mine.length - 1 ? 1 : 0,
              borderBottomColor: theme.colors.surface.border,
            }}
          >
            <Typography variant='body' style={{ flex: 1 }}>
              {transferCopy(transfer, currentUserId, members.data)}
            </Typography>
            <Amount
              value={transfer.amount}
              currency={transfer.currency}
              variant='default'
              showSign={false}
            />
            <Button
              variant='outline'
              size='sm'
              rounded
              loading={settlingKey === key}
              disabled={createSettlement.isPending}
              onPress={() => settleTransfer(transfer)}
            >
              Settle
            </Button>
          </View>
        );
      })}
    </Column>
  );
};
