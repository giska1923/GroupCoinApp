import React, { useState } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Settings, Receipt } from 'lucide-react-native';
import { useTheme } from '../../../../src/theme/ThemeProvider';
import { Screen } from '../../../../src/components/layout/Screen';
import { Header } from '../../../../src/components/layout/Header';
import { Column } from '../../../../src/components/layout/Row';
import { QueryView } from '../../../../src/components/feedback';
import { GroupSettingsSheet } from '../../../../src/components/groups/GroupSettingsSheet';
import { GroupBalanceSummary } from '../../../../src/components/groups/GroupBalanceSummary';
import { SettleUpList } from '../../../../src/components/groups/SettleUpList';
import { ExpenseRow } from '../../../../src/components/groups/ExpenseRow';
import { Sheet } from '../../../../src/components/ui';
import {
  useGroup,
  useGroupExpenses,
  useGroupMembers,
  useDeleteGroup,
  useLeaveGroup,
} from '../../../../src/hooks';
import { useAuthStore } from '../../../../src/stores/auth.store';
import { ClientError } from '../../../../src/api/errors';
import { canManageGroup } from '../../../../src/utils/groupPermissions';
import { DEFAULT_CURRENCY } from '../../../../src/config/currency';
import type { ExpenseDTO } from '../../../../src/types/api';

export default function GroupDetailScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const groupId = String(id);
  const userId = useAuthStore(s => s.user?.id);

  const group = useGroup(groupId);
  const members = useGroupMembers(groupId);
  const expenses = useGroupExpenses(groupId);
  const deleteGroup = useDeleteGroup(groupId);
  const leaveGroup = useLeaveGroup(groupId);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settleUpOpen, setSettleUpOpen] = useState(false);

  const currency = DEFAULT_CURRENCY;
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
            leaveGroup.mutate(myMembership.userId, {
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
        group.refetch();
        members.refetch();
      }}
    >
      <View style={{ paddingHorizontal: theme.spacing.lg }}>
        <Header
          title={group.data?.name ?? 'Group'}
          titleStyle={{ fontSize: theme.fontSize['2xl'] }}
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

      <Column gap='lg' style={{ paddingBottom: theme.spacing.lg }}>
        {/* Margins mirror the Expenses screen: summary at lg, list at xl. */}
        <View style={{ paddingHorizontal: theme.spacing.lg }}>
          <GroupBalanceSummary
            groupId={groupId}
            currency={currency}
            onSettleUp={() => setSettleUpOpen(true)}
            onAddExpense={goToAddExpense}
          />
        </View>

        <View style={{ paddingHorizontal: theme.spacing.xl }}>
          <QueryView
            query={expenses}
            isEmpty={data => data.length === 0}
            emptyTitle='No expenses yet'
            emptyMessage='Add the first expense to start tracking who owes what.'
            emptyIcon={<Receipt size={48} color={theme.colors.text.muted} />}
          >
            {(list: ExpenseDTO[]) => (
              <Column gap='md'>
                {list.map(expense => (
                  <ExpenseRow
                    key={expense.id}
                    expense={expense}
                    currency={currency}
                    members={members.data}
                  />
                ))}
              </Column>
            )}
          </QueryView>
        </View>
      </Column>

      <Sheet
        visible={settleUpOpen}
        onClose={() => setSettleUpOpen(false)}
        title='Settle up'
        showClose
      >
        <SettleUpList groupId={groupId} />
      </Sheet>

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
