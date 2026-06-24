import { router } from 'expo-router';
import type { PushNotificationData } from '../types/api';

function asPushData(
  data: Record<string, unknown> | undefined,
): PushNotificationData | null {
  if (!data || typeof data.type !== 'string') return null;

  if (data.type !== 'GROUP_INVITATION' && data.type !== 'EXPENSE_CREATED') {
    return null;
  }

  return {
    type: data.type,
    groupId: typeof data.groupId === 'string' ? data.groupId : undefined,
    invitationId:
      typeof data.invitationId === 'string' ? data.invitationId : undefined,
    expenseId: typeof data.expenseId === 'string' ? data.expenseId : undefined,
  };
}

/** Navigate to the screen that matches a push notification tap. */
export function navigateFromPushNotification(
  data: Record<string, unknown> | undefined,
): void {
  const payload = asPushData(data);
  if (!payload) return;

  switch (payload.type) {
    case 'GROUP_INVITATION':
      router.push('/(app)/groups/invitations');
      break;
    case 'EXPENSE_CREATED':
      if (payload.groupId) {
        router.push(`/(app)/groups/${payload.groupId}`);
      }
      break;
  }
}
