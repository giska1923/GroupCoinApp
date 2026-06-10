import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Bell, Mail } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Column, Row } from '../layout/Row';
import { Typography, Button, Card, ListItem } from '../ui';
import { QueryView } from '../feedback';
import {
  useInvitations,
  useAcceptInvitation,
  useDeclineInvitation,
} from '../../hooks';
import { formatInvitationExpiry } from '../../utils/format';
import { ClientError } from '../../api/errors';

export const InvitationsInbox: React.FC = () => {
  const theme = useTheme();
  const invitations = useInvitations();
  const acceptInvitation = useAcceptInvitation();
  const declineInvitation = useDeclineInvitation();
  const [actionError, setActionError] = useState<string>();
  const [busyId, setBusyId] = useState<string>();

  const handleAccept = async (id: string, groupId: string) => {
    setActionError(undefined);
    setBusyId(id);
    try {
      await acceptInvitation.mutateAsync(id);
      router.push(`/(app)/groups/${groupId}`);
    } catch (error) {
      setActionError(
        error instanceof ClientError
          ? error.message
          : 'Could not accept the invitation.',
      );
      invitations.refetch();
    } finally {
      setBusyId(undefined);
    }
  };

  const handleDecline = async (id: string) => {
    setActionError(undefined);
    setBusyId(id);
    try {
      await declineInvitation.mutateAsync(id);
    } catch (error) {
      setActionError(
        error instanceof ClientError
          ? error.message
          : 'Could not decline the invitation.',
      );
      invitations.refetch();
    } finally {
      setBusyId(undefined);
    }
  };

  return (
    <Column gap='md'>
      {actionError && (
        <Typography variant='caption' color='negative'>
          {actionError}
        </Typography>
      )}

      <QueryView
        query={invitations}
        isEmpty={items => items.length === 0}
        emptyTitle='No pending invitations'
        emptyMessage='When someone invites you to a group, it will show up here.'
        emptyIcon={<Mail size={48} color={theme.colors.text.muted} />}
      >
        {items => (
          <Card variant='default' padding='none'>
            {items.map((invitation, index) => {
              const isBusy = busyId === invitation.id;
              const groupName = invitation.group?.name ?? 'Group';
              const inviterName = invitation.inviter?.name ?? 'Someone';

              return (
                <ListItem
                  key={invitation.id}
                  title={groupName}
                  subtitle={`Invited by ${inviterName} · ${formatInvitationExpiry(invitation.expiresAt)}`}
                  trailing={
                    <Row gap='sm'>
                      <Button
                        variant='ghost'
                        size='sm'
                        disabled={isBusy}
                        onPress={() => handleDecline(invitation.id)}
                      >
                        Decline
                      </Button>
                      <Button
                        variant='primary'
                        size='sm'
                        loading={isBusy && acceptInvitation.isPending}
                        disabled={isBusy}
                        onPress={() =>
                          handleAccept(invitation.id, invitation.groupId)
                        }
                      >
                        Accept
                      </Button>
                    </Row>
                  }
                  divider={index < items.length - 1}
                />
              );
            })}
          </Card>
        )}
      </QueryView>
    </Column>
  );
};

interface InvitationBellProps {
  count: number;
}

export const InvitationBell: React.FC<InvitationBellProps> = ({ count }) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={() => router.push('/(app)/groups/invitations')}
      hitSlop={8}
      accessibilityLabel={
        count > 0
          ? `${count} pending invitation${count === 1 ? '' : 's'}`
          : 'Invitations'
      }
    >
      <View>
        <Bell size={22} color={theme.colors.text.secondary} />
        {count > 0 && (
          <View
            style={{
              position: 'absolute',
              top: -4,
              right: -6,
              minWidth: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: theme.colors.brand[500],
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 4,
            }}
          >
            <Typography
              variant='label'
              weight='semibold'
              style={{
                color: theme.colors.text.inverse,
                fontSize: 10,
                lineHeight: 12,
              }}
            >
              {count > 9 ? '9+' : String(count)}
            </Typography>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
