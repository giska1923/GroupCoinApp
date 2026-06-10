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
  const currency = currencyOverride ?? DEFAULT_CURRENCY;
  const detail = useExpense(expense.id);

  const splits = detail.data?.splits;
  const yourShare = myOwedShare(splits, userId);
  const net = expenseUserNet(expense, splits, userId);
  const involved = !isZeroAmount(net);
  const positive = isPositiveAmount(net);

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
          <Typography variant='body' weight='semibold'>
            {expense.description}
          </Typography>
          <Typography variant='caption' color='secondary'>
            {payerName} paid {formatMoneyLabel(expense.amount, currency)}
          </Typography>
          {detailLoading ? (
            <Spinner size='small' style={{ alignItems: 'flex-start' }} />
          ) : detailFailed ? (
            <Typography variant='label' color='muted'>
              Could not load your share
            </Typography>
          ) : (
            <Typography variant='caption' color='secondary'>
              Your share: {formatMoneyLabel(yourShare, currency)}
            </Typography>
          )}
          <Typography variant='label' color='muted'>
            {formatShortDate(expense.expenseDate)}
          </Typography>
        </Column>

        <Column
          justify='center'
          align='center'
          gap='xs'
          style={{
            width: 132,
            paddingHorizontal: theme.spacing.md,
            backgroundColor: !involved
              ? theme.colors.surface.tertiary
              : positive
                ? theme.colors.success.bg
                : theme.colors.error.bg,
          }}
        >
          <Typography
            variant='label'
            weight='semibold'
            style={{
              color: !involved
                ? theme.colors.text.muted
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
            <Amount value={net} currency={currency} variant='large' />
          )}
        </Column>
      </View>
    </Card>
    </Pressable>
  );
};
