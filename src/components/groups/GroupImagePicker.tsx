import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { Camera, Users } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Button } from '../ui';

interface GroupImagePickerProps {
  /** Newly picked image as a base64 data URI (controlled by the parent). */
  value?: string;
  /** Existing image to show when nothing new has been picked yet. */
  currentImageUrl?: string | null;
  onChange: (dataUri: string) => void;
  onError?: (message: string) => void;
}

/**
 * Centered circular group-image preview with a pick-from-library button.
 * Picked images are cropped square and shrunk to a 512px JPEG so the
 * base64 payload sent to the API stays small.
 */
export const GroupImagePicker: React.FC<GroupImagePickerProps> = ({
  value,
  currentImageUrl,
  onChange,
  onError,
}) => {
  const theme = useTheme();
  const shownImage = value ?? currentImageUrl ?? undefined;

  const handlePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (result.canceled || !result.assets[0]) return;

      const resized = await manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 512, height: 512 } }],
        { compress: 0.7, format: SaveFormat.JPEG, base64: true },
      );
      if (resized.base64) {
        onChange(`data:image/jpeg;base64,${resized.base64}`);
      }
    } catch {
      onError?.('Could not load that image. Please try another one.');
    }
  };

  return (
    <View style={{ alignItems: 'center', gap: theme.spacing.sm }}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePick}
        style={{
          width: 96,
          height: 96,
          borderRadius: 48,
          backgroundColor: theme.colors.surface.tertiary,
          borderWidth: 1,
          borderColor: 'rgba(138, 137, 255, 0.35)',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {shownImage ? (
          <Image
            source={{ uri: shownImage }}
            style={{ width: 96, height: 96 }}
            resizeMode='cover'
          />
        ) : (
          <Users size={40} color={theme.colors.brand[300]} />
        )}
      </TouchableOpacity>
      <Button
        variant='ghost'
        size='sm'
        icon={<Camera size={14} color={theme.colors.brand[400]} />}
        textColor={theme.colors.brand[400]}
        onPress={handlePick}
      >
        {shownImage ? 'Change image' : 'Add image'}
      </Button>
    </View>
  );
};
