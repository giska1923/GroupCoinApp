import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, usersApi } from '../api/resources';
import { queryKeys } from '../api/queryClient';
import { useAuthStore } from '../stores/auth.store';
import type { UpdateUserPayload } from '../types/api';

export const useUpdateUser = () => {
  const userId = useAuthStore(s => s.user?.id);
  const token = useAuthStore(s => s.token);
  const setSession = useAuthStore(s => s.setSession);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: Pick<UpdateUserPayload, 'name'>) => {
      if (!userId) throw new Error('Not signed in');
      return usersApi.update(userId, body);
    },
    onSuccess: async user => {
      if (token) await setSession(user, token);
      qc.invalidateQueries({ queryKey: queryKeys.auth.me });
      qc.invalidateQueries({ queryKey: queryKeys.groups.all });
    },
  });
};

export const useDeleteUser = () => {
  const token = useAuthStore(s => s.token);

  return useMutation({
    mutationFn: () => {
      if (!token) throw new Error('Not signed in');
      return authApi.deleteMe();
    },
  });
};
