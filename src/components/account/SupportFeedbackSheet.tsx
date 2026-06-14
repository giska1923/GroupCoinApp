import React, { useEffect, useState } from 'react';
import { Alert, TextInput } from 'react-native';
import { ClientError } from '../../api/errors';
import { useSubmitFeedback } from '../../hooks';
import { Sheet, Button, Typography, SegmentedControl } from '../ui';
import { Column } from '../layout/Row';
import { useTheme } from '../../theme/ThemeProvider';
import type { FeedbackTopic } from '../../types/api';

const TOPIC_OPTIONS = [
  { value: 'Bug' as const, label: 'Bug' },
  { value: 'Feature' as const, label: 'Feature' },
  { value: 'General' as const, label: 'General' },
];

interface SupportFeedbackSheetProps {
  visible: boolean;
  onClose: () => void;
}

export const SupportFeedbackSheet: React.FC<SupportFeedbackSheetProps> = ({
  visible,
  onClose,
}) => {
  const theme = useTheme();
  const submitFeedback = useSubmitFeedback();
  const [topic, setTopic] = useState<FeedbackTopic>('General');
  const [message, setMessage] = useState('');
  const [focused, setFocused] = useState(false);

  const trimmed = message.trim();
  const canSubmit = trimmed.length >= 8 && !submitFeedback.isPending;

  const reset = () => {
    setTopic('General');
    setMessage('');
    setFocused(false);
    submitFeedback.reset();
  };

  useEffect(() => {
    if (!visible) reset();
  }, [visible]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    if (!canSubmit) return;

    submitFeedback.mutate(
      { topic, message: trimmed },
      {
        onSuccess: () => {
          Alert.alert(
            'Thanks for your feedback',
            'We received your message and will review it soon.',
            [{ text: 'OK', onPress: handleClose }],
          );
        },
      },
    );
  };

  const errorMessage =
    submitFeedback.error instanceof ClientError
      ? submitFeedback.error.message
      : submitFeedback.error
        ? 'Could not send your feedback. Please try again.'
        : undefined;

  const borderColor = focused
    ? theme.colors.brand[500]
    : theme.colors.surface.border;

  return (
    <Sheet
      visible={visible}
      onClose={handleClose}
      title='Support & Feedback'
      showClose
    >
      <Column gap='lg'>
        <Typography variant='body' color='secondary'>
          Tell us what is working, what is not, or what you would like next.
        </Typography>

        <Column gap='sm'>
          <Typography variant='caption' color='secondary' weight='medium'>
            Topic
          </Typography>
          <SegmentedControl
            options={TOPIC_OPTIONS}
            value={topic}
            onChange={setTopic}
          />
        </Column>

        <Column gap='sm'>
          <Typography variant='caption' color='secondary' weight='medium'>
            Message
          </Typography>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder='Describe your feedback...'
            placeholderTextColor={theme.colors.text.muted}
            selectionColor={theme.colors.brand[400]}
            multiline
            textAlignVertical='top'
            editable={!submitFeedback.isPending}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              minHeight: 120,
              paddingHorizontal: theme.spacing.lg,
              paddingVertical: theme.spacing.md,
              color: theme.colors.text.primary,
              fontSize: theme.fontSize.md,
              backgroundColor: theme.colors.surface.secondary,
              borderRadius: theme.components.input.radius,
              borderWidth: 1,
              borderColor,
            }}
          />
          <Typography
            variant='label'
            color='muted'
            style={{ paddingHorizontal: theme.spacing.xs }}
          >
            At least 8 characters
          </Typography>
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
          loading={submitFeedback.isPending}
          disabled={!canSubmit}
          onPress={handleSubmit}
        >
          Send feedback
        </Button>

        <Button
          variant='ghost'
          size='lg'
          fullWidth
          disabled={submitFeedback.isPending}
          onPress={handleClose}
        >
          Cancel
        </Button>
      </Column>
    </Sheet>
  );
};
