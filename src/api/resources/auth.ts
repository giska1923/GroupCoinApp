import { apiClient } from '../client';
import { endpoints } from '../endpoints';
import type {
  AuthResponseDTO,
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

  me: () => apiClient.get<UserDTO>(endpoints.auth.me).then(r => r.data),
};
