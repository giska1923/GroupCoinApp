import { apiClient } from '../client';
import { endpoints } from '../endpoints';
import type { GroupMemberDTO, InvitationDTO } from '../../types/api';

export const invitationsApi = {
  list: () =>
    apiClient
      .get<InvitationDTO[]>(endpoints.invitations.list)
      .then(r => r.data),

  accept: (id: string) =>
    apiClient
      .post<GroupMemberDTO>(endpoints.invitations.accept(id))
      .then(r => r.data),

  decline: (id: string) =>
    apiClient
      .post<void>(endpoints.invitations.decline(id))
      .then(() => undefined),

  listForGroup: (groupId: string) =>
    apiClient
      .get<InvitationDTO[]>(endpoints.groups.invitations(groupId))
      .then(r => r.data),

  revoke: (groupId: string, invitationId: string) =>
    apiClient
      .delete<void>(endpoints.groups.revokeInvitation(groupId, invitationId))
      .then(() => undefined),
};
