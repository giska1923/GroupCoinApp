import React, { useState } from 'react';
import { router } from 'expo-router';
import { useTheme } from '../../../src/theme/ThemeProvider';
import { Screen } from '../../../src/components/layout/Screen';
import { Header } from '../../../src/components/layout/Header';
import { Row, Column } from '../../../src/components/layout/Row';
import { Typography, TextField, Button, Chip } from '../../../src/components/ui';
import { useCreateGroup } from '../../../src/hooks';
import { ClientError } from '../../../src/api/errors';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY'];

export default function NewGroupScreen() {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState('USD');
  const createGroup = useCreateGroup();

  const canSave = name.trim().length > 0 && !createGroup.isPending;

  const close = () => {
    if (router.canGoBack()) router.back();
  };

  const handleSave = () => {
    createGroup.mutate(
      {
        name: name.trim(),
        description: description.trim() || undefined,
        currency,
      },
      { onSuccess: close },
    );
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

        <Column gap='md'>
          <Typography variant='caption' color='secondary' weight='medium'>
            Default currency
          </Typography>
          <Row gap='sm' wrap>
            {CURRENCIES.map(code => (
              <Chip
                key={code}
                label={code}
                selected={currency === code}
                showCheckWhenSelected={false}
                onPress={() => setCurrency(code)}
              />
            ))}
          </Row>
        </Column>

        {errorMessage && (
          <Typography variant='caption' color='negative'>
            {errorMessage}
          </Typography>
        )}

        <Button
          variant='primary'
          size='lg'
          fullWidth
          loading={createGroup.isPending}
          disabled={!canSave}
          onPress={handleSave}
        >
          Create Group
        </Button>
      </Column>
    </Screen>
  );
}
