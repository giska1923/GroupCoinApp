import { QueryClient } from '@tanstack/react-query';
import { ClientError } from './errors';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failureCount, error) => {
        // Don't retry auth/permission/not-found errors.
        if (error instanceof ClientError) {
          if ([400, 401, 403, 404, 409, 422].includes(error.statusCode)) {
            return false;
          }
        }
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});

/** Centralized query keys for cache coherence + cross-resource invalidation. */
export const queryKeys = {
  auth: { me: ['auth', 'me'] as const },
  groups: {
    all: ['groups'] as const,
    detail: (id: string) => ['groups', 'detail', id] as const,
    members: (id: string) => ['groups', id, 'members'] as const,
  },
  expenses: {
    group: (groupId: string) => ['expenses', 'group', groupId] as const,
    detail: (id: string) => ['expenses', 'detail', id] as const,
  },
  balances: {
    group: (groupId: string) => ['balances', 'group', groupId] as const,
    simplified: (groupId: string) =>
      ['balances', 'simplified', groupId] as const,
  },
  settlements: {
    group: (groupId: string) => ['settlements', 'group', groupId] as const,
  },
  activity: {
    group: (groupId: string) => ['activity', 'group', groupId] as const,
  },
  invitations: {
    all: ['invitations'] as const,
    group: (groupId: string) => ['invitations', 'group', groupId] as const,
  },
};
