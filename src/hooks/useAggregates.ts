import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { activityApi, balancesApi, expensesApi } from '../api/resources';
import { queryKeys } from '../api/queryClient';
import { useAuthStore } from '../stores/auth.store';
import { useGroups } from './useGroups';
import type { ActivityDTO, ExpenseDTO } from '../types/api';

/** Overall net balance across all groups for the signed-in user. */
export const useOverview = () => {
  const groupsQuery = useGroups();
  const userId = useAuthStore(s => s.user?.id);
  const groups = groupsQuery.data ?? [];

  const balanceQueries = useQueries({
    queries: groups.map(group => ({
      queryKey: queryKeys.balances.group(group.id),
      queryFn: () => balancesApi.list(group.id),
      enabled: !!group.id,
      staleTime: 0,
    })),
  });

  const netFlowCents = useMemo(() => {
    if (!userId) return 0;
    return balanceQueries.reduce((sum, q) => {
      const mine = q.data?.find(b => b.userId === userId);
      return sum + (mine?.netBalance ?? 0);
    }, 0);
  }, [balanceQueries, userId]);

  const owedToYou = useMemo(() => {
    if (!userId) return 0;
    return balanceQueries.reduce((sum, q) => {
      const mine = q.data?.find(b => b.userId === userId);
      const v = mine?.netBalance ?? 0;
      return sum + (v > 0 ? v : 0);
    }, 0);
  }, [balanceQueries, userId]);

  const youOwe = useMemo(() => {
    if (!userId) return 0;
    return balanceQueries.reduce((sum, q) => {
      const mine = q.data?.find(b => b.userId === userId);
      const v = mine?.netBalance ?? 0;
      return sum + (v < 0 ? -v : 0);
    }, 0);
  }, [balanceQueries, userId]);

  return {
    groupsQuery,
    groups,
    netFlowCents,
    owedToYou,
    youOwe,
    isLoadingBalances: balanceQueries.some(q => q.isLoading),
  };
};

/** Flattened, date-sorted expenses across every group. */
export const useAllExpenses = () => {
  const groupsQuery = useGroups();
  const groups = groupsQuery.data ?? [];

  const expenseQueries = useQueries({
    queries: groups.map(group => ({
      queryKey: queryKeys.expenses.group(group.id),
      queryFn: () => expensesApi.listByGroup(group.id),
      enabled: !!group.id,
    })),
  });

  const groupNameById = useMemo(
    () => Object.fromEntries(groups.map(g => [g.id, g.name])),
    [groups],
  );

  const expenses = useMemo(() => {
    const all: (ExpenseDTO & { groupName?: string })[] = [];
    expenseQueries.forEach(q => {
      q.data?.forEach(e =>
        all.push({ ...e, groupName: groupNameById[e.groupId] }),
      );
    });
    return all.sort(
      (a, b) =>
        new Date(b.expenseDate).getTime() - new Date(a.expenseDate).getTime(),
    );
  }, [expenseQueries, groupNameById]);

  return {
    expenses,
    isLoading: groupsQuery.isLoading || expenseQueries.some(q => q.isLoading),
    isError: groupsQuery.isError || expenseQueries.some(q => q.isError),
    refetch: () => {
      groupsQuery.refetch();
      expenseQueries.forEach(q => q.refetch());
    },
  };
};

/** Flattened, date-sorted activity across every group. */
export const useAllActivity = () => {
  const groupsQuery = useGroups();
  const groups = groupsQuery.data ?? [];

  const activityQueries = useQueries({
    queries: groups.map(group => ({
      queryKey: queryKeys.activity.group(group.id),
      queryFn: () => activityApi.listByGroup(group.id),
      enabled: !!group.id,
    })),
  });

  const activity = useMemo(() => {
    const all: ActivityDTO[] = [];
    activityQueries.forEach(q => q.data?.forEach(a => all.push(a)));
    return all.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [activityQueries]);

  return {
    activity,
    isLoading: groupsQuery.isLoading || activityQueries.some(q => q.isLoading),
    isError: groupsQuery.isError || activityQueries.some(q => q.isError),
    refetch: () => {
      groupsQuery.refetch();
      activityQueries.forEach(q => q.refetch());
    },
  };
};
