import { apiClient } from '../client';
import { endpoints } from '../endpoints';
import type {
  CreateExpensePayload,
  ExpenseDTO,
  ExpenseDetailDTO,
  ExpenseSplitDTO,
  UpdateExpensePayload,
  UserDTO,
} from '../../types/api';
import { normalizeAmount } from '../../utils/money';
import { resolveCurrency } from '../../config/currency';

type RawExpense = ExpenseDTO & {
  amount?: string | number;
  paid_by?: string;
  paidByUser?: UserDTO;
  paid_by_user?: UserDTO;
  splits?: RawSplit[];
};

type RawSplit = ExpenseSplitDTO & {
  owed_amount?: string | number;
  amount?: string | number;
};

type RawExpenseDetail =
  | ExpenseDetailDTO
  | (ExpenseDTO & { splits?: RawSplit[]; group?: ExpenseDetailDTO['group'] });

const normalizeSplit = (raw: RawSplit): ExpenseSplitDTO => ({
  id: raw.id,
  expenseId: raw.expenseId,
  userId: String(raw.userId),
  owedAmount: normalizeAmount(raw.owedAmount ?? raw.owed_amount ?? raw.amount),
  user: raw.user,
});

const normalizeExpense = (raw: RawExpense): ExpenseDTO => {
  const { splits: _splits, paid_by_user, ...rest } = raw;
  return {
    ...rest,
    id: raw.id,
    description: raw.description ?? '',
    amount: normalizeAmount(raw.amount),
    currency: resolveCurrency(raw.currency),
    paidBy: String(raw.paidBy ?? raw.paid_by ?? ''),
    groupId: raw.groupId ?? '',
    expenseDate: raw.expenseDate ?? new Date().toISOString(),
    splitType: raw.splitType ?? 'EQUAL',
    createdAt: raw.createdAt ?? new Date().toISOString(),
    updatedAt: raw.updatedAt ?? new Date().toISOString(),
    paidByUser: raw.paidByUser ?? paid_by_user,
  };
};

const normalizeDetail = (raw: RawExpenseDetail): ExpenseDetailDTO => {
  if ('expense' in raw && raw.expense) {
    return {
      expense: normalizeExpense(raw.expense as RawExpense),
      splits: (raw.splits ?? []).map(normalizeSplit),
      group: raw.group,
    };
  }

  const flat = raw as RawExpense & { group?: ExpenseDetailDTO['group'] };
  const { splits = [], group, ...expenseFields } = flat;
  return {
    expense: normalizeExpense(expenseFields),
    splits: splits.map(normalizeSplit),
    group,
  };
};

export const expensesApi = {
  listByGroup: (groupId: string) =>
    apiClient
      .get<RawExpense[]>(endpoints.groups.expenses(groupId))
      .then(r => r.data.map(normalizeExpense)),

  get: (id: string) =>
    apiClient
      .get<RawExpenseDetail>(endpoints.expenses.detail(id))
      .then(r => normalizeDetail(r.data)),

  create: (groupId: string, body: CreateExpensePayload) =>
    apiClient
      .post<RawExpenseDetail>(endpoints.groups.expenses(groupId), body)
      .then(r => normalizeDetail(r.data)),

  update: (id: string, body: UpdateExpensePayload) =>
    apiClient
      .put<RawExpenseDetail>(endpoints.expenses.update(id), body)
      .then(r => normalizeDetail(r.data)),

  remove: (id: string) =>
    apiClient.delete<void>(endpoints.expenses.remove(id)).then(() => undefined),
};
