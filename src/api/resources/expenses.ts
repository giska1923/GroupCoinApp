import { apiClient } from '../client';
import { endpoints } from '../endpoints';
import type {
  CreateExpensePayload,
  ExpenseDTO,
  ExpenseDetailDTO,
  UpdateExpensePayload,
} from '../../types/api';

export const expensesApi = {
  listByGroup: (groupId: string) =>
    apiClient
      .get<ExpenseDTO[]>(endpoints.groups.expenses(groupId))
      .then(r => r.data),

  get: (id: string) =>
    apiClient
      .get<ExpenseDetailDTO>(endpoints.expenses.detail(id))
      .then(r => r.data),

  create: (groupId: string, body: CreateExpensePayload) =>
    apiClient
      .post<ExpenseDetailDTO>(endpoints.groups.expenses(groupId), body)
      .then(r => r.data),

  update: (id: string, body: UpdateExpensePayload) =>
    apiClient
      .put<ExpenseDetailDTO>(endpoints.expenses.update(id), body)
      .then(r => r.data),

  remove: (id: string) =>
    apiClient.delete<void>(endpoints.expenses.remove(id)).then(() => undefined),
};
