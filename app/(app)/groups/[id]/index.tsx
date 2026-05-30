import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Settings, Plus, Receipt } from 'lucide-react-native';
import { useTheme } from '../../../../src/theme/ThemeProvider';
import { Screen } from '../../../../src/components/layout/Screen';
import { Header } from '../../../../src/components/layout/Header';
import { Column } from '../../../../src/components/layout/Row';
import { Typography, Card, Button, Amount } from '../../../../src/components/ui';
import { QueryView } from '../../../../src/components/feedback';
import {
  useGroup,
  useGroupExpenses,
  useBalances,
} from '../../../../src/hooks';
import { useAuthStore } from '../../../../src/stores/auth.store';
import { expenseUserNet } from '../../../../src/utils/expense';
import { formatShortDate } from '../../../../src/utils/format';
import type { ExpenseDTO } from '../../../../src/types/api';

export default function GroupDetailScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const groupId = String(id);
  const userId = useAuthStore(s => s.user?.id);

  const group = useGroup(groupId);
  const expenses = useGroupExpenses(groupId);
  const balances = useBalances(groupId);

  const currency = group.data?.currency ?? 'USD';
  const myBalance =
    balances.data?.find(b => b.userId === userId)?.netBalance ?? 0;

  return (
    <Screen
      variant='scroll'
      padding='none'
      refreshing={expenses.isRefetching}
      onRefresh={() => {
        expenses.refetch();
        balances.refetch();
        group.refetch();
      }}
    >
      <View style={{ paddingHorizontal: theme.spacing.lg }}>
        <Header
          title={group.data?.name ?? 'Group'}
          right={<Settings size={22} color={theme.colors.text.secondary} />}
        />
      </View>

      <Column
        gap='lg'
        style={{
          paddingHorizontal: theme.spacing.lg,
          paddingBottom: theme.spacing['6xl'],
        }}
      >
        {/* Group balance summary */}
        <Card variant='elevated' padding='lg' style={{ alignItems: 'center' }}>
          <Typography variant='caption' color='secondary'>
            {myBalance >= 0 ? 'Overall, you are owed' : 'Overall, you owe'}
          </Typography>
          <Amount
            value={myBalance}
            currency={currency}
            variant='display'
            showSign={false}
          />
          <View style={{ alignItems: 'center', marginTop: theme.spacing.md }}>
            <Button variant='primary' size='md' rounded onPress={() => {}}>
              Settle Up
            </Button>
          </View>
        </Card>

        <QueryView
          query={expenses}
          isEmpty={data => data.length === 0}
          emptyTitle='No expenses yet'
          emptyMessage='Add the first expense to start tracking who owes what.'
          emptyIcon={<Receipt size={48} color={theme.colors.text.muted} />}
          emptyAction={{
            label: 'Add expense',
            onPress: () => router.push(`/(app)/groups/${groupId}/add-expense`),
          }}
        >
          {(list: ExpenseDTO[]) => (
            <Column gap='md'>
              {list.map(expense => {
                const net = expenseUserNet(expense, userId);
                const positive = net > 0;
                const involved = net !== 0;
                return (
                  <Card
                    key={expense.id}
                    variant='default'
                    padding='none'
                    style={{ overflow: 'hidden' }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
                      <Column
                        gap='xs'
                        style={{ flex: 1, padding: theme.spacing.lg }}
                      >
                        <Typography variant='body' weight='semibold'>
                          {expense.description}
                        </Typography>
                        <Typography variant='caption' color='secondary'>
                          {expense.paidByUser?.name ?? 'Someone'} paid{' '}
                          {symbol(currency)}
                          {(expense.amount / 100).toFixed(2)}
                        </Typography>
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
                          <Amount
                            value={net}
                            currency={currency}
                            variant='large'
                          />
                        )}
                      </Column>
                    </View>
                  </Card>
                );
              })}
            </Column>
          )}
        </QueryView>
      </Column>

      <View
        style={{
          position: 'absolute',
          bottom: theme.spacing['3xl'],
          right: theme.spacing.lg,
        }}
      >
        <Button
          variant='primary'
          size='fab'
          icon={<Plus size={24} color={theme.colors.text.primary} />}
          onPress={() => router.push(`/(app)/groups/${groupId}/add-expense`)}
        />
      </View>
    </Screen>
  );
}

const symbol = (code: string): string =>
  ({ USD: '$', EUR: '€', GBP: '£', JPY: '¥' })[code] ?? `${code} `;
