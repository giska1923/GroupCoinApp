import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/auth.store';
import { env } from '../config/env';
import {
  connectInvitationsSocket,
  disconnectInvitationsSocket,
} from '../realtime/invitationsSocket';
import { queryKeys } from '../api/queryClient';

/** Keeps the invitations socket alive while authenticated. */
export function useInvitationsRealtime() {
  const token = useAuthStore(s => s.token);
  const qc = useQueryClient();

  useEffect(() => {
    if (!token) {
      disconnectInvitationsSocket();
      return;
    }

    connectInvitationsSocket(token, env.apiUrl, qc);
    qc.invalidateQueries({ queryKey: queryKeys.invitations.all });

    return () => disconnectInvitationsSocket();
  }, [token, qc]);
}
