import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { ClientError } from '../../api/errors';
import { useUpdateUser } from '../../hooks';
import { Sheet, Button, TextField, Typography } from '../ui';
import { Column } from '../layout/Row';

interface EditAccountSheetProps {
  visible: boolean;
  onClose: () => void;
  currentName?: string;
}

export const EditAccountSheet: React.FC<EditAccountSheetProps> = ({
  visible,
  onClose,
  currentName = '',
}) => {
  const updateUser = useUpdateUser();
  const [name, setName] = useState(currentName);

  const trimmed = name.trim();
  const canSave =
    trimmed.length > 0 &&
    trimmed !== currentName.trim() &&
    !updateUser.isPending;

  useEffect(() => {
    if (visible) setName(currentName);
  }, [visible, currentName]);

  const reset = () => {
    setName(currentName);
    updateUser.reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSave = () => {
    if (!canSave) return;

    updateUser.mutate(
      { name: trimmed },
      {
        onSuccess: () => {
          Alert.alert('Profile updated', 'Your name has been saved.', [
            { text: 'OK', onPress: handleClose },
          ]);
        },
      },
    );
  };

  const errorMessage =
    updateUser.error instanceof ClientError
      ? updateUser.error.message
      : updateUser.error
        ? 'Could not update your profile. Please try again.'
        : undefined;

  return (
    <Sheet
      visible={visible}
      onClose={handleClose}
      title='Edit account'
      showClose
    >
      <Column gap='lg'>
        <TextField
          label='Name'
          value={name}
          onChangeText={setName}
          placeholder='Your name'
          autoCapitalize='words'
          editable={!updateUser.isPending}
        />

        {errorMessage && (
          <Typography variant='caption' color='negative'>
            {errorMessage}
          </Typography>
        )}

        <Button
          variant='primary'
          size='lg'
          fullWidth
          loading={updateUser.isPending}
          disabled={!canSave}
          onPress={handleSave}
        >
          Save
        </Button>

        <Button
          variant='ghost'
          size='lg'
          fullWidth
          disabled={updateUser.isPending}
          onPress={handleClose}
        >
          Cancel
        </Button>
      </Column>
    </Sheet>
  );
};
