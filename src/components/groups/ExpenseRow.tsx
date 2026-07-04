import React from 'react';
import { View, Pressable } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useAuthStore } from '../../stores/auth.store';
import { useExpense } from '../../hooks/useExpenses';
import { ClientError } from '../../api/errors';
import type { ExpenseDTO } from '../../types/api';
import { Column } from '../layout/Row';
import { Typography, Card, Amount } from '../ui';
import { Spinner } from '../feedback';
import { expenseUserNet, myOwedShare } from '../../utils/expense';
import { formatShortDate } from '../../utils/format';
import { isZeroAmount, isPositiveAmount, formatMoneyLabel } from '../../utils/money';
import { resolveMemberDisplayName } from '../../utils/memberDisplay';
import { DEFAULT_CURRENCY } from '../../config/currency';
import type { GroupMemberDTO } from '../../types/api';

interface ExpenseRowProps {
  expense: ExpenseDTO;
  currency?: string;
  members?: GroupMemberDTO[];
  onPress?: () => void;
}

export const ExpenseRow: React.FC<ExpenseRowProps> = ({
  expense,
  currency: currencyOverride,
  members,
  onPress,
}) => {
  const theme = useTheme();
  const userId = useAuthStore(s => s.user?.id);
  const currency = currencyOverride ?? expense.currency ?? DEFAULT_CURRENCY;
  const detail = useExpense(expense.id);

  const splits = detail.data?.splits;
  const yourShare = myOwedShare(splits, userId);
  const net = expenseUserNet(expense, splits, userId);
  const involved = !isZeroAmount(net);
  const positive = isPositiveAmount(net);
  const settled = !!expense.settledAt;

  const detailLoading = detail.isLoading && !detail.data;
  const detailFailed =
    detail.isError &&
    detail.error instanceof ClientError &&
    [401, 403, 404].includes(detail.error.statusCode);

  const payerName = resolveMemberDisplayName(expense.paidBy, {
    currentUserId: userId,
    members,
    user: expense.paidByUser ?? detail.data?.expense.paidByUser,
  });

  return (
    <Pressable onPress={onPress} disabled={!onPress}>
    <Card
      variant='default'
      padding='none'
      style={{ overflow: 'hidden' }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
        <Column gap='xs' style={{ flex: 1, padding: theme.spacing.lg }}>
          <Typography variant='heading' weight='bold' numberOfLines={1}>
            {expense.description}
          </Typography>
          <Typography variant='subheading' color='secondary' numberOfLines={1}>
            {payerName} paid {formatMoneyLabel(expense.amount, currency)}
          </Typography>
          {detailLoading ? (
            <Spinner size='small' style={{ alignItems: 'flex-start' }} />
          ) : detailFailed ? (
            <Typography variant='body' color='muted' numberOfLines={1}>
              Could not load your share
            </Typography>
          ) : (
            <Typography variant='subheading' color='secondary' numberOfLines={1}>
              Your share: {formatMoneyLabel(yourShare, currency)}
            </Typography>
          )}
          <Typography variant='body' color='muted' numberOfLines={1}>
            {formatShortDate(expense.expenseDate)}
          </Typography>
        </Column>

        <Column
          justify='center'
          align='center'
          gap='xs'
          style={{
            // Proportional width so the split looks consistent on every screen
            // size; a fixed pixel width takes a different share on each device.
            width: '38%',
            paddingHorizontal: theme.spacing.md,
            backgroundColor: !involved
              ? theme.colors.surface.tertiary
              : settled
                ? positive
                  ? '#1d2b25' // washed-out green for settled debts
                  : '#2b1d1e' // washed-out red for settled debts
                : positive
                  ? '#06392b' // deepened green (text stays bright)
                  : '#591414', // deepened red (text stays bright)
          }}
        >
          <Typography
            variant='subheading'
            weight='semibold'
            align='center'
            numberOfLines={1}
            style={{
              color: !involved
                ? theme.colors.text.muted
                : settled
                  ? positive
                    ? theme.colors.financialPositiveMuted
                    : theme.colors.financialNegativeMuted
                  : positive
                    ? theme.colors.financialPositive
                    : theme.colors.financialNegative,
            }}
          >
            {!involved
              ? 'Not involved'
              : positive
                ? 'Owes You'
                : 'You Owe'}
          </Typography>
          {involved && (
            <Amount
              value={net}
              currency={currency}
              variant='display'
              type={
                settled
                  ? positive
                    ? 'positiveMuted'
                    : 'negativeMuted'
                  : undefined
              }
            />
          )}
          {settled && involved && (
            <Typography
              variant='caption'
              align='center'
              numberOfLines={1}
              style={{ color: theme.colors.text.muted, letterSpacing: 0.5 }}
            >
              Settled
            </Typography>
          )}
        </Column>
      </View>
    </Card>
    </Pressable>
  );
};
