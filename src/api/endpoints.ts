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
    me: '/auth/me',
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
    removeMember: (groupId: string, memberId: string) =>
      `/groups/${groupId}/members/${memberId}`,
    balances: (id: string) => `/groups/${id}/balances`,
    simplified: (id: string) => `/groups/${id}/balances/simplified`,
    expenses: (id: string) => `/groups/${id}/expenses`,
    settlements: (id: string) => `/groups/${id}/settlements`,
    activity: (id: string) => `/groups/${id}/activity`,
  },
  expenses: {
    detail: (id: string) => `/expenses/${id}`,
    update: (id: string) => `/expenses/${id}`,
    remove: (id: string) => `/expenses/${id}`,
  },
} as const;
