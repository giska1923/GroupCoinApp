import { apiClient } from '../client';
import { endpoints } from '../endpoints';
import type {
  AuthResponseDTO,
  GoogleLoginPayload,
  LoginPayload,
  PendingVerificationDTO,
  RegisterPayload,
  ResendVerificationPayload,
  UserDTO,
  VerifyEmailPayload,
} from '../../types/api';

export const authApi = {
  login: (body: LoginPayload) =>
    apiClient
      .post<AuthResponseDTO>(endpoints.auth.login, body)
      .then(r => r.data),

  /** Creates the account and triggers a verification email. No session yet. */
  register: (body: RegisterPayload) =>
    apiClient
      .post<PendingVerificationDTO>(endpoints.auth.register, body)
      .then(r => r.data),

  /** Confirms the emailed code and, on success, returns a real session. */
  verifyEmail: (body: VerifyEmailPayload) =>
    apiClient
      .post<AuthResponseDTO>(endpoints.auth.verifyEmail, body)
      .then(r => r.data),

  resendVerification: (body: ResendVerificationPayload) =>
    apiClient
      .post<PendingVerificationDTO>(endpoints.auth.resendVerification, body)
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
