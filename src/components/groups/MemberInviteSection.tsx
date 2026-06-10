import React, { useState } from 'react';
import { X } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Row, Column } from '../layout/Row';
import {
  Typography,
  TextField,
  Button,
  Chip,
  Avatar,
  ListItem,
  Card,
} from '../ui';
import type { GroupMemberDTO } from '../../types/api';

interface MemberInviteSectionProps {
  pendingEmails: string[];
  onAddEmail: (email: string) => void;
  onRemoveEmail: (email: string) => void;
  existingMembers?: GroupMemberDTO[];
  inviteError?: string;
}

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const MemberInviteSection: React.FC<MemberInviteSectionProps> = ({
  pendingEmails,
  onAddEmail,
  onRemoveEmail,
  existingMembers,
  inviteError,
}) => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [localError, setLocalError] = useState<string>();

  const normalized = email.trim().toLowerCase();
  const existingEmails = new Set([
    ...(existingMembers?.map(m => (m.user?.email ?? '').toLowerCase()) ?? []),
    ...pendingEmails.map(e => e.toLowerCase()),
  ]);

  const handleAdd = () => {
    if (!normalized) return;

    if (!isValidEmail(normalized)) {
      setLocalError('Enter a valid email address.');
      return;
    }

    if (existingEmails.has(normalized)) {
      setLocalError('That member is already in the group or pending list.');
      return;
    }

    setLocalError(undefined);
    onAddEmail(normalized);
    setEmail('');
  };

  const errorMessage = localError ?? inviteError;

  return (
    <Column gap='md'>
      <Typography variant='caption' color='secondary' weight='medium'>
        Members
      </Typography>

      {existingMembers && existingMembers.length > 0 && (
        <Card variant='default' padding='none'>
          {existingMembers.map((member, index) => (
            <ListItem
              key={member.id}
              title={member.user?.name ?? 'Member'}
              subtitle={member.user?.email ?? undefined}
              leading={
                <Avatar
                  size='sm'
                  initials={member.user?.name ?? 'M'}
                  backgroundColor={theme.colors.brand[900]}
                />
              }
              divider={index < existingMembers.length - 1}
            />
          ))}
        </Card>
      )}

      <Row gap='sm' align='flex-start'>
        <TextField
          label='Add by email'
          placeholder='friend@example.com'
          value={email}
          onChangeText={value => {
            setEmail(value);
            if (localError) setLocalError(undefined);
          }}
          keyboardType='email-address'
          autoCapitalize='none'
          autoCorrect={false}
          containerStyle={{ flex: 1 }}
          error={errorMessage}
          hint={
            !errorMessage
              ? 'An invitation will be sent. They can join after accepting.'
              : undefined
          }
          onSubmitEditing={handleAdd}
          returnKeyType='done'
        />
        <Button
          variant='secondary'
          size='md'
          onPress={handleAdd}
          disabled={!normalized}
          style={{ marginTop: theme.spacing.lg + theme.spacing.sm }}
        >
          Add
        </Button>
      </Row>

      {pendingEmails.length > 0 && (
        <Row gap='sm' wrap>
          {pendingEmails.map(pending => (
            <Chip
              key={pending}
              label={pending}
              leading={
                <X size={14} color={theme.colors.text.secondary} />
              }
              onPress={() => onRemoveEmail(pending)}
            />
          ))}
        </Row>
      )}
    </Column>
  );
};
