import React from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { useAuthStore } from '../../stores/auth.store';
import { useBalances } from '../../hooks/useBalances';
import { Column, Row } from '../layout/Row';
import { Typography, Card, Amount, Button } from '../ui';
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
      <Card variant='elevated' padding='lg' style={{ alignItems: 'center' }}>
        <Spinner size='small' />
      </Card>
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

  return (
    <Card
      variant='elevated'
      padding='xl'
      style={{ alignItems: 'center', paddingVertical: theme.spacing['2xl'] }}
    >
      <Typography variant='subheading' weight='semibold' color='secondary'>
        {label}
      </Typography>

      {myBalances.length === 1 ? (
        <Amount
          value={primary.amount}
          currency={primary.currency}
          variant='displayLg'
          showSign={false}
        />
      ) : (
        <Column gap='xs' style={{ alignItems: 'center', marginTop: theme.spacing.xs }}>
          {myBalances.map(entry => (
            <Row key={entry.currency} gap='sm' align='center'>
              <Amount
                value={entry.amount}
                currency={entry.currency}
                variant='large'
                showSign={false}
              />
              <Typography variant='caption' color='muted'>
                {entry.currency}
              </Typography>
            </Row>
          ))}
        </Column>
      )}

      {(onSettleUp || onAddExpense) && (
        <Row justify='center' gap='md' style={{ marginTop: theme.spacing.md }}>
          {onSettleUp && (
            <Button variant='primary' size='md' rounded onPress={onSettleUp}>
              Settle Up
            </Button>
          )}
          {onAddExpense && (
            <Button variant='primary' size='md' rounded onPress={onAddExpense}>
              Add expense
            </Button>
          )}
        </Row>
      )}
    </Card>
  );
};
