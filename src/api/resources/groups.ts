import { apiClient } from '../client';
import { endpoints } from '../endpoints';
import { getGroupOwnerId } from '../../utils/groupPermissions';
import type {
  CreateGroupPayload,
  GroupDTO,
  GroupDetailDTO,
  GroupMemberDTO,
  InvitationDTO,
  UpdateGroupPayload,
  UserDTO,
} from '../../types/api';

type RawGroup = GroupDTO & {
  defaultCurrency?: string;
  owner_id?: string;
  owner?: { id?: string };
  createdBy?: string;
  created_by?: string;
};

type RawGroupDetail = GroupDetailDTO & {
  group?: RawGroup;
};

function normalizeGroup(raw: RawGroup): GroupDTO {
  const ownerId = getGroupOwnerId(raw);
  return {
    ...raw,
    id: raw.id ?? '',
    name: raw.name ?? '',
    description: raw.description ?? null,
    currency: raw.currency ?? raw.defaultCurrency ?? 'USD',
    ownerId: ownerId ?? raw.ownerId ?? '',
  };
}

function unwrapGroupPayload(data: RawGroup | RawGroupDetail): GroupDTO {
  if (data && typeof data === 'object' && 'group' in data && data.group) {
    return normalizeGroup(data.group);
  }
  return normalizeGroup(data as RawGroup);
}

type RawMember = GroupMemberDTO & {
  user_id?: string;
  user?: Partial<UserDTO> & {
    name?: string;
    email?: string;
  };
  name?: string;
  email?: string;
  createdAt?: string;
};

function normalizeMember(raw: RawMember): GroupMemberDTO {
  const role = String(raw.role ?? 'MEMBER').toUpperCase();
  const userId = String(raw.userId ?? raw.user_id ?? raw.user?.id ?? '');
  const joinedAt = raw.joinedAt ?? raw.createdAt ?? new Date().toISOString();
  const user: UserDTO = {
    id: userId,
    name: raw.user?.name ?? raw.name ?? 'Member',
    email: raw.user?.email ?? raw.email ?? '',
    contact: raw.user?.contact ?? null,
    role: raw.user?.role ?? 'BASIC',
    createdAt: raw.user?.createdAt ?? joinedAt,
    updatedAt: raw.user?.updatedAt ?? joinedAt,
  };

  return {
    ...raw,
    userId,
    user,
    joinedAt,
    createdAt: raw.createdAt ?? joinedAt,
    role:
      role === 'ADMIN' || role === 'OWNER'
        ? (role as GroupMemberDTO['role'])
        : 'MEMBER',
  };
}

function toCreateBody(body: CreateGroupPayload) {
  const { currency, inviteEmails, ...rest } = body;
  return {
    ...rest,
    defaultCurrency: currency,
    ...(inviteEmails?.length ? { inviteEmails } : {}),
  };
}

function toUpdateBody(body: UpdateGroupPayload) {
  const { currency, ...rest } = body;
  return {
    ...rest,
    ...(currency !== undefined ? { defaultCurrency: currency } : {}),
  };
}

export const groupsApi = {
  list: () =>
    apiClient
      .get<RawGroup[]>(endpoints.groups.list)
      .then(r => r.data.map(normalizeGroup)),

  get: (id: string) =>
    apiClient
      .get<RawGroup | RawGroupDetail>(endpoints.groups.detail(id))
      .then(r => unwrapGroupPayload(r.data)),

  create: (body: CreateGroupPayload) =>
    apiClient
      .post<RawGroup | RawGroupDetail>(endpoints.groups.create, toCreateBody(body))
      .then(r => unwrapGroupPayload(r.data)),

  update: (id: string, body: UpdateGroupPayload) =>
    apiClient
      .put<RawGroup>(endpoints.groups.update(id), toUpdateBody(body))
      .then(r => normalizeGroup(r.data)),

  remove: (id: string) =>
    apiClient.delete<void>(endpoints.groups.remove(id)).then(() => undefined),

  members: (id: string) =>
    apiClient
      .get<RawMember[]>(endpoints.groups.members(id))
      .then(r => r.data.map(normalizeMember)),

  /** Sends an invitation (does not add a member immediately). */
  inviteMember: (id: string, email: string, role?: 'MEMBER' | 'ADMIN') =>
    apiClient
      .post<InvitationDTO>(endpoints.groups.addMember(id), {
        email,
        ...(role ? { role } : {}),
      })
      .then(r => r.data),

  removeMember: (groupId: string, memberId: string) =>
    apiClient
      .delete<void>(endpoints.groups.removeMember(groupId, memberId))
      .then(() => undefined),
};
