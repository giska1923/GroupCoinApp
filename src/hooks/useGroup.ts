import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { groupsApi } from '../api/resources';
import { queryKeys } from '../api/queryClient';
import type { UpdateGroupPayload } from '../types/api';

export const useGroup = (id: string) =>
  useQuery({
    queryKey: queryKeys.groups.detail(id),
    queryFn: () => groupsApi.get(id),
    enabled: !!id,
  });

export const useGroupMembers = (id: string) =>
  useQuery({
    queryKey: queryKeys.groups.members(id),
    queryFn: () => groupsApi.members(id),
    enabled: !!id,
  });

export const useUpdateGroup = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateGroupPayload) => groupsApi.update(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.groups.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.groups.all });
    },
  });
};

export const useDeleteGroup = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => groupsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.groups.all });
    },
  });
};

export const useInviteMember = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (email: string) => groupsApi.inviteMember(id, email),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.groups.members(id) });
      qc.invalidateQueries({ queryKey: queryKeys.groups.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.invitations.group(id) });
    },
  });
};

/** @deprecated Use useInviteMember — members are added via invitation accept. */
export const useAddMember = useInviteMember;

export const useLeaveGroup = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (memberId: string) => groupsApi.removeMember(id, memberId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.groups.all });
      qc.removeQueries({ queryKey: queryKeys.groups.detail(id) });
    },
  });
};
