import { apiClient } from '../client';
import { endpoints } from '../endpoints';
import type {
  AuthResponseDTO,
  GoogleLoginPayload,
  LoginPayload,
  RegisterPayload,
  UserDTO,
} from '../../types/api';

export const authApi = {
  login: (body: LoginPayload) =>
    apiClient
      .post<AuthResponseDTO>(endpoints.auth.login, body)
      .then(r => r.data),

  register: (body: RegisterPayload) =>
    apiClient
      .post<AuthResponseDTO>(endpoints.auth.register, body)
      .then(r => r.data),

  google: (body: GoogleLoginPayload) =>
    apiClient
      .post<AuthResponseDTO>(endpoints.auth.google, body)
      .then(r => r.data),

  /** Revokes the refresh token server-side. Best-effort on logout. */
  logout: (refreshToken: string) =>
    apiClient
      .post<void>(endpoints.auth.logout, { refreshToken })
      .then(() => undefined),

  me: () => apiClient.get<UserDTO>(endpoints.auth.me).then(r => r.data),

  deleteMe: () =>
    apiClient.delete<void>(endpoints.auth.me).then(() => undefined),
};
