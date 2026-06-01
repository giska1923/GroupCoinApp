import { apiClient } from '../client';
import { endpoints } from '../endpoints';
import type { ActivityDTO, ActivityPageDTO } from '../../types/api';

export const activityApi = {
  listByGroup: (
    groupId: string,
    params?: { limit?: number; offset?: number },
  ) =>
    apiClient
      .get<ActivityPageDTO>(endpoints.groups.activity(groupId), { params })
      .then(r => r.data.items),
};
