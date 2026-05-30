import { apiClient } from '../client';
import { endpoints } from '../endpoints';
import type {
  CreateGroupPayload,
  GroupDTO,
  GroupMemberDTO,
  UpdateGroupPayload,
} from '../../types/api';

export const groupsApi = {
  list: () => apiClient.get<GroupDTO[]>(endpoints.groups.list).then(r => r.data),

  get: (id: string) =>
    apiClient.get<GroupDTO>(endpoints.groups.detail(id)).then(r => r.data),

  create: (body: CreateGroupPayload) =>
    apiClient.post<GroupDTO>(endpoints.groups.create, body).then(r => r.data),

  update: (id: string, body: UpdateGroupPayload) =>
    apiClient
      .put<GroupDTO>(endpoints.groups.update(id), body)
      .then(r => r.data),

  remove: (id: string) =>
    apiClient.delete<void>(endpoints.groups.remove(id)).then(() => undefined),

  members: (id: string) =>
    apiClient
      .get<GroupMemberDTO[]>(endpoints.groups.members(id))
      .then(r => r.data),

  addMember: (id: string, email: string) =>
    apiClient
      .post<GroupMemberDTO>(endpoints.groups.addMember(id), { email })
      .then(r => r.data),

  removeMember: (groupId: string, memberId: string) =>
    apiClient
      .delete<void>(endpoints.groups.removeMember(groupId, memberId))
      .then(() => undefined),
};
