import { apiClient } from '../client';
import { endpoints } from '../endpoints';
import type {
  CreateSettlementPayload,
  SettlementDTO,
} from '../../types/api';

export const settlementsApi = {
  listByGroup: (groupId: string) =>
    apiClient
      .get<SettlementDTO[]>(endpoints.groups.settlements(groupId))
      .then(r => r.data),

  create: (groupId: string, body: CreateSettlementPayload) =>
    apiClient
      .post<SettlementDTO>(endpoints.groups.settlements(groupId), body)
      .then(r => r.data),
};
