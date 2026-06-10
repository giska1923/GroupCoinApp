import type { GroupMemberDTO, UserDTO } from '../types/api';

/** Display name for a group member; "You" for the signed-in user. */
export const resolveMemberDisplayName = (
  targetUserId: string | undefined,
  options: {
    currentUserId?: string;
    members?: GroupMemberDTO[];
    user?: UserDTO | null;
  } = {},
): string => {
  const { currentUserId, members, user } = options;

  if (!targetUserId) return 'Someone';
  if (currentUserId && String(targetUserId) === String(currentUserId)) {
    return 'You';
  }
  if (user?.name) return user.name;

  const member = members?.find(m => String(m.userId) === String(targetUserId));
  if (member?.user?.name) return member.user.name;

  return 'Someone';
};
