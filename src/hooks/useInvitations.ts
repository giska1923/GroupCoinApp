import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { invitationsApi } from '../api/resources';
import { queryKeys } from '../api/queryClient';

export const useInvitations = () =>
  useQuery({
    queryKey: queryKeys.invitations.all,
    queryFn: invitationsApi.list,
  });

export const useGroupInvitations = (groupId: string) =>
  useQuery({
    queryKey: queryKeys.invitations.group(groupId),
    queryFn: () => invitationsApi.listForGroup(groupId),
    enabled: !!groupId,
  });

export const useAcceptInvitation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => invitationsApi.accept(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.invitations.all });
      qc.invalidateQueries({ queryKey: queryKeys.groups.all });
    },
  });
};

export const useDeclineInvitation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => invitationsApi.decline(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.invitations.all });
    },
  });
};

export const useRevokeInvitation = (groupId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (invitationId: string) =>
      invitationsApi.revoke(groupId, invitationId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.invitations.group(groupId) });
    },
  });
};
