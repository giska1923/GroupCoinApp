import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { groupsApi } from '../api/resources';
import { queryKeys } from '../api/queryClient';
import type { CreateGroupPayload } from '../types/api';

export const useGroups = () =>
  useQuery({
    queryKey: queryKeys.groups.all,
    queryFn: groupsApi.list,
  });

export const useCreateGroup = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateGroupPayload) => groupsApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.groups.all });
    },
  });
};
