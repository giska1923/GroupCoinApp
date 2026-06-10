import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { activityApi, balancesApi, expensesApi, groupsApi } from '../api/resources';
import { queryKeys } from '../api/queryClient';
import { useAuthStore } from '../stores/auth.store';
import { useGroups } from './useGroups';
import type { ActivityDTO, ExpenseDTO } from '../types/api';

export interface SplitContact {
  id: string;
  name: string;
  email: string;
  groupNames: string[];
}
import { addAmounts, isNegativeAmount, isPositiveAmount, myBalanceAmounts, negateAmount, ZERO } from '../utils/money';
import { DEFAULT_CURRENCY } from '../config/currency';

/** Overall net balance across all groups for the signed-in user (per primary group currency). */
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

  const balanceForGroup = (index: number): string => {
    const group = groups[index];
    if (!group) return ZERO;
    const amounts = myBalanceAmounts(
      balanceQueries[index]?.data ?? [],
      userId,
      DEFAULT_CURRENCY,
    );
    const primary =
      amounts.find(a => a.currency === DEFAULT_CURRENCY) ?? amounts[0];
    return primary?.amount ?? ZERO;
  };

  const netFlow = useMemo(() => {
    if (!userId) return ZERO;
    return balanceQueries.reduce(
      (sum, _q, index) => addAmounts(sum, balanceForGroup(index)),
      ZERO,
    );
  }, [balanceQueries, groups, userId]);

  const owedToYou = useMemo(() => {
    if (!userId) return ZERO;
    return balanceQueries.reduce((sum, _q, index) => {
      const amount = balanceForGroup(index);
      return isPositiveAmount(amount) ? addAmounts(sum, amount) : sum;
    }, ZERO);
  }, [balanceQueries, groups, userId]);

  const youOwe = useMemo(() => {
    if (!userId) return ZERO;
    return balanceQueries.reduce((sum, _q, index) => {
      const amount = balanceForGroup(index);
      return isNegativeAmount(amount) ? addAmounts(sum, negateAmount(amount)) : sum;
    }, ZERO);
  }, [balanceQueries, groups, userId]);

  return {
    groupsQuery,
    groups,
    netFlow,
    /** @deprecated Use netFlow (decimal string). Kept for Amount backwards compat. */
    netFlowCents: netFlow,
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

/** Unique people the signed-in user shares at least one group with. */
export const useSplitContacts = () => {
  const groupsQuery = useGroups();
  const groups = groupsQuery.data ?? [];
  const userId = useAuthStore(s => s.user?.id);

  const memberQueries = useQueries({
    queries: groups.map(group => ({
      queryKey: queryKeys.groups.members(group.id),
      queryFn: () => groupsApi.members(group.id),
      enabled: !!group.id,
    })),
  });

  const contacts = useMemo(() => {
    if (!userId) return [];

    const groupNameById = Object.fromEntries(groups.map(g => [g.id, g.name]));
    const byUserId = new Map<string, SplitContact>();

    memberQueries.forEach((query, index) => {
      const groupId = groups[index]?.id;
      if (!groupId || !query.data) return;

      const groupName = groupNameById[groupId] ?? 'Group';

      query.data.forEach(member => {
        if (String(member.userId) === String(userId)) return;

        const user = member.user;
        if (!user) return;

        const existing = byUserId.get(member.userId);
        if (existing) {
          if (!existing.groupNames.includes(groupName)) {
            existing.groupNames.push(groupName);
          }
          return;
        }

        byUserId.set(member.userId, {
          id: member.userId,
          name: user.name,
          email: user.email,
          groupNames: [groupName],
        });
      });
    });

    return Array.from(byUserId.values()).sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
    );
  }, [memberQueries, groups, userId]);

  return {
    contacts,
    count: contacts.length,
    isLoading: groupsQuery.isLoading || memberQueries.some(q => q.isLoading),
    isError: groupsQuery.isError || memberQueries.some(q => q.isError),
    refetch: () => {
      groupsQuery.refetch();
      memberQueries.forEach(q => q.refetch());
    },
  };
};
