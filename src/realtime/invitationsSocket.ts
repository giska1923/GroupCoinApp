import { io, type Socket } from 'socket.io-client';
import type { QueryClient } from '@tanstack/react-query';
import { queryKeys } from '../api/queryClient';
import type { InvitationDTO } from '../types/api';

export const INVITATION_RECEIVED_EVENT = 'invitation:received';

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

  return socket;
}

export function disconnectInvitationsSocket(): void {
  socket?.disconnect();
  socket = null;
}
