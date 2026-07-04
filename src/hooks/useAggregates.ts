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
import { centsToMoney, moneyToCents, myBalanceAmounts, ZERO } from '../utils/money';
import { DEFAULT_CURRENCY, resolveCurrency } from '../config/currency';

export interface CurrencyAmount {
  currency: string;
  amount: string;
}

/** USD first, then alphabetical — keeps the primary currency on top. */
const byCurrency = (a: CurrencyAmount, b: CurrencyAmount): number => {
  if (a.currency === DEFAULT_CURRENCY) return -1;
  if (b.currency === DEFAULT_CURRENCY) return 1;
  return a.currency.localeCompare(b.currency);
};

/**
 * Overall net balance across all groups for the signed-in user, aggregated
 * per currency. Amounts in different currencies are never summed together
 * (that would need FX conversion) — each currency gets its own entry.
 */
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

  const { netFlow, owedToYou, youOwe } = useMemo(() => {
    const net = new Map<string, bigint>();
    const owed = new Map<string, bigint>();
    const owing = new Map<string, bigint>();

    if (userId) {
      balanceQueries.forEach((query, index) => {
        const group = groups[index];
        if (!group) return;
        const amounts = myBalanceAmounts(
          query.data ?? [],
          userId,
          resolveCurrency(group.currency),
        );
        amounts.forEach(({ currency, amount }) => {
          const cents = moneyToCents(amount);
          if (cents === 0n) return;
          net.set(currency, (net.get(currency) ?? 0n) + cents);
          if (cents > 0n) {
            owed.set(currency, (owed.get(currency) ?? 0n) + cents);
          } else {
            owing.set(currency, (owing.get(currency) ?? 0n) - cents);
          }
        });
      });
    }

    // Drop currencies that cancelled out to zero; fall back to a single USD
    // zero entry so consumers always have something to render.
    const toList = (map: Map<string, bigint>): CurrencyAmount[] => {
      const entries = Array.from(map.entries())
        .filter(([, cents]) => cents !== 0n)
        .map(([currency, cents]) => ({ currency, amount: centsToMoney(cents) }))
        .sort(byCurrency);
      return entries.length > 0
        ? entries
        : [{ currency: DEFAULT_CURRENCY, amount: ZERO }];
    };

    return {
      netFlow: toList(net),
      owedToYou: toList(owed),
      youOwe: toList(owing),
    };
  }, [balanceQueries, groups, userId]);

  return {
    groupsQuery,
    groups,
    netFlow,
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
