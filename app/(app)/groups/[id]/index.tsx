import React, { useState } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Settings, Receipt } from 'lucide-react-native';
import { useTheme } from '../../../../src/theme/ThemeProvider';
import { Screen } from '../../../../src/components/layout/Screen';
import { Header } from '../../../../src/components/layout/Header';
import { Column, Row } from '../../../../src/components/layout/Row';
import { Typography, Card, Button, Amount } from '../../../../src/components/ui';
import { QueryView } from '../../../../src/components/feedback';
import { GroupSettingsSheet } from '../../../../src/components/groups/GroupSettingsSheet';
import {
  useGroup,
  useGroupExpenses,
  useGroupMembers,
  useBalances,
  useDeleteGroup,
  useLeaveGroup,
} from '../../../../src/hooks';
import { useAuthStore } from '../../../../src/stores/auth.store';
import { expenseUserNet } from '../../../../src/utils/expense';
import { formatShortDate } from '../../../../src/utils/format';
import { ClientError } from '../../../../src/api/errors';
import { canManageGroup } from '../../../../src/utils/groupPermissions';
import type { ExpenseDTO } from '../../../../src/types/api';

export default function GroupDetailScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const groupId = String(id);
  const userId = useAuthStore(s => s.user?.id);

  const group = useGroup(groupId);
  const members = useGroupMembers(groupId);
  const expenses = useGroupExpenses(groupId);
  const balances = useBalances(groupId);
  const deleteGroup = useDeleteGroup(groupId);
  const leaveGroup = useLeaveGroup(groupId);

  const [settingsOpen, setSettingsOpen] = useState(false);

  const currency = group.data?.currency ?? 'USD';
  const myBalance =
    balances.data?.find(b => b.userId === userId)?.netBalance ?? 0;
  const myMembership = members.data?.find(
    m => String(m.userId) === String(userId),
  );
  const canManage = canManageGroup(group.data, myMembership, userId, {
    memberCount: members.data?.length ?? group.data?.memberCount,
  });
  const settingsLoading = deleteGroup.isPending || leaveGroup.isPending;

  const goToAddExpense = () =>
    router.push(`/(app)/groups/${groupId}/add-expense`);

  const goToEdit = () => {
    setSettingsOpen(false);
    router.push(`/(app)/groups/${groupId}/edit`);
  };

  const goToGroups = () => router.replace('/(app)/groups');

  const showActionError = (error: unknown, fallback: string) => {
    Alert.alert(
      'Something went wrong',
      error instanceof ClientError ? error.message : fallback,
    );
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete group?',
      'This permanently deletes the group and all of its expenses.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () =>
            deleteGroup.mutate(undefined, {
              onSuccess: goToGroups,
              onError: error =>
                showActionError(error, 'Could not delete the group.'),
            }),
        },
      ],
    );
  };

  const confirmLeave = () => {
    if (!myMembership) {
      Alert.alert('Unable to leave', 'Your membership could not be found.');
      return;
    }

    Alert.alert(
      'Leave group?',
      'You will no longer see this group or its expenses.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: () =>
            leaveGroup.mutate(myMembership.id, {
              onSuccess: goToGroups,
              onError: error =>
                showActionError(error, 'Could not leave the group.'),
            }),
        },
      ],
    );
  };

  return (
    <Screen
      variant='scroll'
      padding='none'
      refreshing={expenses.isRefetching}
      onRefresh={() => {
        expenses.refetch();
        balances.refetch();
        group.refetch();
        members.refetch();
      }}
    >
      <View style={{ paddingHorizontal: theme.spacing.lg }}>
        <Header
          title={group.data?.name ?? 'Group'}
          right={
            <TouchableOpacity
              onPress={() => setSettingsOpen(true)}
              hitSlop={8}
              style={{
                width: 40,
                height: 40,
                borderRadius: theme.radius.full,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.colors.surface.secondary,
              }}
            >
              <Settings size={22} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          }
        />
      </View>

      <Column
        gap='lg'
        style={{
          paddingHorizontal: theme.spacing.lg,
          paddingBottom: theme.spacing.lg,
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
          <Row justify='center' gap='md' style={{ marginTop: theme.spacing.md }}>
            <Button variant='primary' size='md' rounded onPress={() => {}}>
              Settle Up
            </Button>
            <Button variant='primary' size='md' rounded onPress={goToAddExpense}>
              Add expense
            </Button>
          </Row>
        </Card>

        <QueryView
          query={expenses}
          isEmpty={data => data.length === 0}
          emptyTitle='No expenses yet'
          emptyMessage='Add the first expense to start tracking who owes what.'
          emptyIcon={<Receipt size={48} color={theme.colors.text.muted} />}
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

      <GroupSettingsSheet
        visible={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        canManage={canManage}
        loading={settingsLoading}
        onEdit={goToEdit}
        onDelete={() => {
          setSettingsOpen(false);
          confirmDelete();
        }}
        onLeave={() => {
          setSettingsOpen(false);
          confirmLeave();
        }}
      />
    </Screen>
  );
}

const symbol = (code: string): string =>
  ({ USD: '$', EUR: '€', GBP: '£', JPY: '¥' })[code] ?? `${code} `;
