import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../../../src/theme/ThemeProvider';
import { Screen } from '../../../../src/components/layout/Screen';
import { Header } from '../../../../src/components/layout/Header';
import { Column } from '../../../../src/components/layout/Row';
import { Typography, TextField, Button } from '../../../../src/components/ui';
import { Spinner, ErrorState } from '../../../../src/components/feedback';
import { MemberInviteSection } from '../../../../src/components/groups/MemberInviteSection';
import { GroupImagePicker } from '../../../../src/components/groups/GroupImagePicker';
import {
  useGroup,
  useGroupMembers,
  useUpdateGroup,
  useInviteMember,
} from '../../../../src/hooks';
import { ClientError } from '../../../../src/api/errors';
import { DEFAULT_CURRENCY } from '../../../../src/config/currency';

export default function EditGroupScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const groupId = String(id);

  const group = useGroup(groupId);
  const members = useGroupMembers(groupId);
  const updateGroup = useUpdateGroup(groupId);
  const inviteMember = useInviteMember(groupId);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  // Newly picked image as a base64 data URI; undefined = keep the current one.
  const [newImage, setNewImage] = useState<string>();
  const [pendingEmails, setPendingEmails] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string>();

  useEffect(() => {
    if (!group.data) return;
    setName(group.data.name ?? '');
    setDescription(group.data.description ?? '');
  }, [group.data]);

  const canSave =
    (name ?? '').trim().length > 0 &&
    !saving &&
    !updateGroup.isPending &&
    !inviteMember.isPending;

  const close = () => {
    if (router.canGoBack()) router.back();
  };

  const handleSave = async () => {
    setSaveError(undefined);
    setSaving(true);

    try {
      await updateGroup.mutateAsync({
        name: (name ?? '').trim(),
        description: (description ?? '').trim() || undefined,
        currency: DEFAULT_CURRENCY,
        ...(newImage ? { imageUrl: newImage } : {}),
      });

      for (const email of pendingEmails) {
        await inviteMember.mutateAsync(email);
      }

      setPendingEmails([]);
      close();
    } catch (error) {
      setSaveError(
        error instanceof ClientError
          ? error.message
          : 'Could not save the group. Please try again.',
      );
    } finally {
      setSaving(false);
    }
  };

  if (group.isLoading || members.isLoading) {
    return (
      <Screen variant='fixed' padding='lg'>
        <Spinner fill />
      </Screen>
    );
  }

  if (group.isError || !group.data) {
    return (
      <Screen variant='fixed' padding='lg'>
        <ErrorState error={group.error} onRetry={() => group.refetch()} />
      </Screen>
    );
  }

  return (
    <Screen variant='scroll' padding='lg' edges={['top', 'left', 'right']}>
      <Header
        title='Edit Group'
        leading='close'
        onLeadingPress={close}
        right={
          <Button
            variant='ghost'
            size='sm'
            disabled={!canSave}
            textColor={
              canSave ? theme.colors.brand[400] : theme.colors.text.muted
            }
            onPress={handleSave}
          >
            Save
          </Button>
        }
      />

      <Column gap='xl' style={{ paddingTop: theme.spacing.lg }}>
        <GroupImagePicker
          value={newImage}
          currentImageUrl={group.data.imageUrl}
          onChange={setNewImage}
          onError={setSaveError}
        />

        <TextField
          label='Group name'
          placeholder='e.g. Tokyo Trip'
          value={name}
          onChangeText={setName}
        />

        <TextField
          label='Description (optional)'
          placeholder='What is this group for?'
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <MemberInviteSection
          existingMembers={members.data}
          pendingEmails={pendingEmails}
          onAddEmail={email =>
            setPendingEmails(prev =>
              prev.includes(email) ? prev : [...prev, email],
            )
          }
          onRemoveEmail={email =>
            setPendingEmails(prev => prev.filter(item => item !== email))
          }
        />

        {saveError && (
          <Typography variant='caption' color='negative'>
            {saveError}
          </Typography>
        )}

        <Button
          variant='primary'
          size='lg'
          fullWidth
          loading={saving}
          disabled={!canSave}
          onPress={handleSave}
        >
          Save Changes
        </Button>
      </Column>
    </Screen>
  );
}
