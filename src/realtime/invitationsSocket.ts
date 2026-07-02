import { io, type Socket } from 'socket.io-client';
import type { QueryClient } from '@tanstack/react-query';
import { queryKeys } from '../api/queryClient';
import type { InvitationDTO } from '../types/api';

export const INVITATION_RECEIVED_EVENT = 'invitation:received';
/** Broadcast by the backend to all group members when group data changes. */
export const GROUP_UPDATED_EVENT = 'group:updated';

let socket: Socket | null = null;

export function connectInvitationsSocket(
  token: string,
  apiBaseUrl: string,
  queryClient: QueryClient,
): Socket {
  socket?.disconnect();

  socket = io(apiBaseUrl, {
    auth: { token },
    transports: ['websocket', 'polling'],
  });

  // Events fired while the connection was down are lost — after a reconnect,
  // mark everything stale so active screens refetch and catch up.
  socket.io.on('reconnect', () => {
    queryClient.invalidateQueries();
  });

  socket.on(INVITATION_RECEIVED_EVENT, (invitation: InvitationDTO) => {
    queryClient.setQueryData<InvitationDTO[]>(
      queryKeys.invitations.all,
      old => {
        if (!old) return [invitation];
        if (old.some(item => item.id === invitation.id)) return old;
        return [invitation, ...old];
      },
    );
  });

  // Another member changed an expense or settlement: refetch everything we
  // hold for that group so all devices converge without a manual refresh.
  socket.on(GROUP_UPDATED_EVENT, (payload: { groupId?: string }) => {
    const groupId = payload?.groupId;
    if (!groupId) return;

    queryClient.invalidateQueries({ queryKey: queryKeys.groups.all });
    queryClient.invalidateQueries({
      queryKey: queryKeys.groups.detail(groupId),
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.groups.members(groupId),
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.expenses.group(groupId),
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.balances.group(groupId),
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.balances.simplified(groupId),
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.settlements.group(groupId),
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.activity.group(groupId),
    });
  });

  return socket;
}

export function disconnectInvitationsSocket(): void {
  socket?.disconnect();
  socket = null;
}
