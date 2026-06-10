import type { ActivityDTO } from '../types/api';

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

/** "Today" / "Yesterday" / "May 27, 2026" for section headers. */
export const formatDateGroup = (iso: string): string => {
  const date = new Date(iso);
  const today = startOfDay(new Date());
  const day = startOfDay(date);
  const dayMs = 86_400_000;

  if (day === today) return 'Today';
  if (day === today - dayMs) return 'Yesterday';

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatShortDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

/** e.g. "Expires in 5 days" / "Expires today" / "Expired" */
export const formatInvitationExpiry = (expiresAt: string): string => {
  const now = Date.now();
  const expiry = new Date(expiresAt).getTime();
  const diffMs = expiry - now;

  if (diffMs <= 0) return 'Expired';

  const diffDays = Math.ceil(diffMs / 86_400_000);
  if (diffDays === 1) return 'Expires in 1 day';
  if (diffDays <= 7) return `Expires in ${diffDays} days`;

  return `Expires ${formatShortDate(expiresAt)}`;
};

export interface ActivityCopy {
  actor: string;
  action: string;
  target: string;
  amount?: number; // cents (unsigned)
}

/** Maps an activity event to display copy, reading structured metadata. */
export const formatActivity = (activity: ActivityDTO): ActivityCopy => {
  const actor = activity.actor?.name ?? 'Someone';
  const meta = activity.metadata ?? {};
  const description = (meta.description as string) ?? 'an item';
  const amount =
    typeof meta.amount === 'number' ? (meta.amount as number) : undefined;

  switch (activity.type) {
    case 'EXPENSE_CREATED':
      return { actor, action: 'added', target: description, amount };
    case 'EXPENSE_UPDATED':
      return { actor, action: 'updated', target: description, amount };
    case 'EXPENSE_DELETED':
      return { actor, action: 'deleted', target: description, amount };
    case 'SETTLEMENT_CREATED':
      return {
        actor,
        action: 'recorded a settlement',
        target: (meta.toUserName as string) ?? '',
        amount,
      };
    case 'MEMBER_JOINED':
      return { actor, action: 'joined the group', target: '' };
    case 'MEMBER_LEFT':
      return { actor, action: 'left the group', target: '' };
    default:
      return { actor, action: 'updated the group', target: '' };
  }
};
