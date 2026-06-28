/**
 * Single source of truth for backend paths. Adjust these to match the
 * GroupCoin REST API if a route differs from the README contract.
 *
 * Base URL is configured in `src/config/env.ts` (defaults to
 * http://localhost:3000 for local testing).
 */
export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    google: '/auth/google',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    me: '/auth/me',
    deviceTokens: '/auth/device-tokens',
  },
  users: {
    update: (id: string) => `/users/${id}`,
  },
  groups: {
    list: '/groups',
    create: '/groups',
    detail: (id: string) => `/groups/${id}`,
    update: (id: string) => `/groups/${id}`,
    remove: (id: string) => `/groups/${id}`,
    members: (id: string) => `/groups/${id}/members`,
    addMember: (id: string) => `/groups/${id}/members`,
    removeMember: (groupId: string, userId: string) =>
      `/groups/${groupId}/members/${userId}`,
    balances: (id: string) => `/groups/${id}/balances`,
    simplified: (id: string) => `/groups/${id}/balances/simplified`,
    expenses: (id: string) => `/groups/${id}/expenses`,
    settlements: (id: string) => `/groups/${id}/settlements`,
    activity: (id: string) => `/groups/${id}/activity`,
    invitations: (id: string) => `/groups/${id}/invitations`,
    revokeInvitation: (groupId: string, invitationId: string) =>
      `/groups/${groupId}/invitations/${invitationId}`,
  },
  invitations: {
    list: '/invitations',
    accept: (id: string) => `/invitations/${id}/accept`,
    decline: (id: string) => `/invitations/${id}/decline`,
  },
  expenses: {
    detail: (id: string) => `/expenses/${id}`,
    update: (id: string) => `/expenses/${id}`,
    remove: (id: string) => `/expenses/${id}`,
  },
  feedback: {
    submit: '/feedback',
  },
} as const;
