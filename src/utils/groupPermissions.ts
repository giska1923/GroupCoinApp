import type { GroupDTO, GroupMemberDTO } from '../types/api';

type RawGroup = GroupDTO & {
  owner_id?: string;
  owner?: { id?: string };
  createdBy?: string;
  created_by?: string;
};

/** Normalize owner id from common API response shapes. */
export function getGroupOwnerId(group: GroupDTO | undefined): string | undefined {
  if (!group) return undefined;

  const raw = group as RawGroup;
  const ownerId =
    raw.ownerId ??
    raw.owner_id ??
    raw.owner?.id ??
    raw.createdBy ??
    raw.created_by;

  return ownerId != null ? String(ownerId) : undefined;
}

export function isGroupOwner(
  group: GroupDTO | undefined,
  userId: string | undefined,
): boolean {
  if (!userId) return false;
  const ownerId = getGroupOwnerId(group);
  return ownerId != null && ownerId === String(userId);
}

/** Owner or group admin can edit/delete group settings. */
export function canManageGroup(
  group: GroupDTO | undefined,
  membership: GroupMemberDTO | undefined,
  userId: string | undefined,
  options?: { memberCount?: number },
): boolean {
  if (isGroupOwner(group, userId)) return true;
  if (membership?.role === 'ADMIN' || membership?.role === 'OWNER') return true;

  const count = options?.memberCount;
  if (
    count === 1 &&
    membership &&
    userId &&
    String(membership.userId) === String(userId)
  ) {
    return true;
  }

  return false;
}
