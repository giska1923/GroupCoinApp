import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useAuthStore } from '../../stores/auth.store';
import { useBalances } from '../../hooks/useBalances';
import { Column, Row } from '../layout/Row';
import { Typography, Amount, Button } from '../ui';
import { Spinner, ErrorState } from '../feedback';
import {
  isPositiveAmount,
  isZeroAmount,
  myBalanceAmounts,
} from '../../utils/money';
import { DEFAULT_CURRENCY } from '../../config/currency';

interface GroupBalanceSummaryProps {
  groupId: string;
  /** Group currency; defaults to USD until multi-currency is supported. */
  currency?: string;
  onSettleUp?: () => void;
  onAddExpense?: () => void;
}

export const GroupBalanceSummary: React.FC<GroupBalanceSummaryProps> = ({
  groupId,
  currency = DEFAULT_CURRENCY,
  onSettleUp,
  onAddExpense,
}) => {
  const theme = useTheme();
  const userId = useAuthStore(s => s.user?.id);
  const balances = useBalances(groupId);

  if (balances.isLoading) {
    return (
      <View style={{ alignItems: 'center', paddingVertical: theme.spacing.lg }}>
        <Spinner size='small' />
      </View>
    );
  }

  if (balances.isError && !balances.data) {
    return (
      <ErrorState error={balances.error} onRetry={() => balances.refetch()} />
    );
  }

  const myBalances = myBalanceAmounts(
    balances.data ?? [],
    userId,
    currency,
  );

  const primary =
    myBalances.find(b => b.currency === currency) ?? myBalances[0] ?? {
      currency,
      amount: '0.00',
    };

  const settled = isZeroAmount(primary.amount);
  const owedToYou = isPositiveAmount(primary.amount);
  const label = settled
    ? 'You are all settled up'
    : owedToYou
      ? 'Overall, you are owed'
      : 'Overall, you owe';

  // Darker neutral translucent fill + subtle neutral border, lifted by our
  // signature soft purple glow (same hue as the FAB halo).
  const actionButtonStyle = {
    backgroundColor: 'rgba(20, 20, 26, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    shadowColor: theme.colors.brand[400],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 12,
    elevation: 8,
  } as const;

  return (
    <View style={{ alignItems: 'center', paddingVertical: theme.spacing.lg }}>
      <Typography
        variant='subheading'
        color='primary'
        weight='medium'
        align='center'
        style={{ marginBottom: theme.spacing.sm, opacity: 0.8 }}
      >
        {label}
      </Typography>

      {myBalances.length === 1 ? (
        <Amount
          value={primary.amount}
          currency={primary.currency}
          variant='hero'
          glow={!settled}
        />
      ) : (
        <Column gap='xs' style={{ alignItems: 'center', marginTop: theme.spacing.xs }}>
          {myBalances.map(entry => (
            <Row key={entry.currency} gap='sm' align='center'>
              <Amount
                value={entry.amount}
                currency={entry.currency}
                variant='display'
              />
              <Typography variant='caption' color='muted'>
                {entry.currency}
              </Typography>
            </Row>
          ))}
        </Column>
      )}

      {(onSettleUp || onAddExpense) && (
        <Row justify='center' gap='md' style={{ marginTop: theme.spacing.lg }}>
          {onSettleUp && (
            <Button
              variant='secondary'
              size='md'
              rounded
              textColor={theme.colors.text.primary}
              textWeight='bold'
              style={actionButtonStyle}
              onPress={onSettleUp}
            >
              Settle Up
            </Button>
          )}
          {onAddExpense && (
            <Button
              variant='secondary'
              size='md'
              rounded
              textColor={theme.colors.text.primary}
              textWeight='bold'
              style={actionButtonStyle}
              onPress={onAddExpense}
            >
              Add expense
            </Button>
          )}
        </Row>
      )}
    </View>
  );
};
