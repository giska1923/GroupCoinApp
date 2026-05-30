import { apiClient } from '../client';
import { endpoints } from '../endpoints';
import type { UpdateUserPayload, UserDTO } from '../../types/api';

export const usersApi = {
  update: (id: string, body: UpdateUserPayload) =>
    apiClient
      .put<UserDTO>(endpoints.users.update(id), body)
      .then(r => r.data),
};
