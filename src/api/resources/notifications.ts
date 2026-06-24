import { apiClient } from '../client';
import { endpoints } from '../endpoints';
import type {
  DeviceTokenDTO,
  RegisterDeviceTokenPayload,
} from '../../types/api';

export const notificationsApi = {
  registerDeviceToken: (body: RegisterDeviceTokenPayload) =>
    apiClient
      .post<DeviceTokenDTO>(endpoints.auth.deviceTokens, body)
      .then(r => r.data),

  removeDeviceToken: (token: string) =>
    apiClient
      .delete<void>(endpoints.auth.deviceTokens, { data: { token } })
      .then(() => undefined),
};
