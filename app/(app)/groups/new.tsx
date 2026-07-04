import React, { useState } from 'react';
import { router } from 'expo-router';
import { useTheme } from '../../../src/theme/ThemeProvider';
import { Screen } from '../../../src/components/layout/Screen';
import { Header } from '../../../src/components/layout/Header';
import { Column } from '../../../src/components/layout/Row';
import { Typography, TextField, Button } from '../../../src/components/ui';
import { MemberInviteSection } from '../../../src/components/groups/MemberInviteSection';
import { GroupImagePicker } from '../../../src/components/groups/GroupImagePicker';
import { CurrencyPicker } from '../../../src/components/groups/CurrencyPicker';
import { useCreateGroup } from '../../../src/hooks';
import { ClientError } from '../../../src/api/errors';
import { DEFAULT_CURRENCY } from '../../../src/config/currency';

export default function NewGroupScreen() {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
  // Optional image (base64 data URI); the backend assigns a default if omitted.
  const [image, setImage] = useState<string>();
  const [imageError, setImageError] = useState<string>();
  const [pendingEmails, setPendingEmails] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const createGroup = useCreateGroup();

  const canSave = name.trim().length > 0 && !saving && !createGroup.isPending;

  const close = () => {
    if (router.canGoBack()) router.back();
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      await createGroup.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
        currency,
        imageUrl: image,
        inviteEmails: pendingEmails.length > 0 ? pendingEmails : undefined,
      });

      close();
    } catch {
      // Error surfaced via createGroup.error below.
    } finally {
      setSaving(false);
    }
  };

  const errorMessage =
    createGroup.error instanceof ClientError
      ? createGroup.error.message
      : createGroup.error
        ? 'Could not create the group. Please try again.'
        : undefined;

  return (
    <Screen variant='scroll' padding='lg' edges={['top', 'left', 'right']}>
      <Header
        title='New Group'
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
          value={image}
          onChange={uri => {
            setImageError(undefined);
            setImage(uri);
          }}
          onError={setImageError}
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

        <CurrencyPicker
          value={currency}
          onChange={setCurrency}
          hint='All expenses in this group will use this currency.'
        />

        <MemberInviteSection
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

        {(errorMessage ?? imageError) && (
          <Typography variant='caption' color='negative'>
            {errorMessage ?? imageError}
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
          Create Group
        </Button>
      </Column>
    </Screen>
  );
}
