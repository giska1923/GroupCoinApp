import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useAuthStore } from '../../stores/auth.store';
import { useSimplifiedTransfers } from '../../hooks/useBalances';
import { useGroupMembers } from '../../hooks/useGroup';
import { ClientError } from '../../api/errors';
import type { GroupMemberDTO, SimplifiedTransferDTO } from '../../types/api';
import { resolveMemberDisplayName } from '../../utils/memberDisplay';
import { Column } from '../layout/Row';
import { Typography, Amount } from '../ui';
import { Spinner, ErrorState, EmptyState } from '../feedback';
import { isZeroAmount } from '../../utils/money';
import { DEFAULT_CURRENCY, isSupportedCurrency } from '../../config/currency';

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

export const SettleUpList: React.FC<SettleUpListProps> = ({ groupId }) => {
  const theme = useTheme();
  const currentUserId = useAuthStore(s => s.user?.id);
  const transfers = useSimplifiedTransfers(groupId);
  const members = useGroupMembers(groupId);

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
      {mine.map((transfer, index) => (
        <View
          key={`${transfer.fromUserId}-${transfer.toUserId}-${transfer.currency}-${index}`}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: theme.spacing.sm,
            borderBottomWidth: index < mine.length - 1 ? 1 : 0,
            borderBottomColor: theme.colors.surface.border,
          }}
        >
          <Typography variant='body' style={{ flex: 1, paddingRight: theme.spacing.md }}>
            {transferCopy(transfer, currentUserId, members.data)}
          </Typography>
          <Amount
            value={transfer.amount}
            currency={DEFAULT_CURRENCY}
            variant='default'
            showSign={false}
          />
        </View>
      ))}
    </Column>
  );
};
