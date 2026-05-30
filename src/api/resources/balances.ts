import { apiClient } from '../client';
import { endpoints } from '../endpoints';
import type { BalanceDTO, SimplifiedTransferDTO } from '../../types/api';

export const balancesApi = {
  list: (groupId: string) =>
    apiClient
      .get<BalanceDTO[]>(endpoints.groups.balances(groupId))
      .then(r => r.data),

  simplified: (groupId: string) =>
    apiClient
      .get<SimplifiedTransferDTO[]>(endpoints.groups.simplified(groupId))
      .then(r => r.data),
};
