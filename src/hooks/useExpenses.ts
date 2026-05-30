import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { expensesApi } from '../api/resources';
import { queryKeys } from '../api/queryClient';
import type { CreateExpensePayload, UpdateExpensePayload } from '../types/api';

export const useGroupExpenses = (groupId: string) =>
  useQuery({
    queryKey: queryKeys.expenses.group(groupId),
    queryFn: () => expensesApi.listByGroup(groupId),
    enabled: !!groupId,
  });

export const useExpense = (id: string) =>
  useQuery({
    queryKey: queryKeys.expenses.detail(id),
    queryFn: () => expensesApi.get(id),
    enabled: !!id,
  });

/** Invalidate everything an expense write affects: list, balances, activity. */
const invalidateExpenseEffects = (
  qc: ReturnType<typeof useQueryClient>,
  groupId: string,
) => {
  qc.invalidateQueries({ queryKey: queryKeys.expenses.group(groupId) });
  qc.invalidateQueries({ queryKey: queryKeys.balances.group(groupId) });
  qc.invalidateQueries({ queryKey: queryKeys.balances.simplified(groupId) });
  qc.invalidateQueries({ queryKey: queryKeys.activity.group(groupId) });
  qc.invalidateQueries({ queryKey: queryKeys.groups.detail(groupId) });
};

export const useCreateExpense = (groupId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateExpensePayload) =>
      expensesApi.create(groupId, body),
    onSuccess: () => invalidateExpenseEffects(qc, groupId),
  });
};

export const useUpdateExpense = (groupId: string, expenseId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateExpensePayload) =>
      expensesApi.update(expenseId, body),
    onSuccess: () => {
      invalidateExpenseEffects(qc, groupId);
      qc.invalidateQueries({ queryKey: queryKeys.expenses.detail(expenseId) });
    },
  });
};

export const useDeleteExpense = (groupId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (expenseId: string) => expensesApi.remove(expenseId),
    onSuccess: () => invalidateExpenseEffects(qc, groupId),
  });
};
