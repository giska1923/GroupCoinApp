import { apiClient } from '../client';
import { endpoints } from '../endpoints';
import type { ActivityDTO } from '../../types/api';

export const activityApi = {
  listByGroup: (groupId: string, params?: { page?: number; limit?: number }) =>
    apiClient
      .get<ActivityDTO[]>(endpoints.groups.activity(groupId), { params })
      .then(r => r.data),
};
