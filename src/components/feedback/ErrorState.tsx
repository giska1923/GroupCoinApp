import React from 'react';
import { View } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { ClientError } from '../../api/errors';
import { Column } from '../layout/Row';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';

interface ErrorStateProps {
  error: unknown;
  onRetry?: () => void;
}

const messageOf = (error: unknown): string => {
  if (error instanceof ClientError) return error.message;
  if (error instanceof Error) return error.message;
  return 'Something went wrong.';
};

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  const theme = useTheme();
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing['5xl'],
        paddingHorizontal: theme.spacing.lg,
      }}
    >
      <Column align='center' gap='lg'>
        <AlertCircle size={48} color={theme.colors.financialNegative} />
        <Column align='center' gap='xs'>
          <Typography variant='subheading' weight='semibold' align='center'>
            Couldn't load this
          </Typography>
          <Typography variant='body' color='secondary' align='center'>
            {messageOf(error)}
          </Typography>
        </Column>
        {onRetry && (
          <Button variant='secondary' size='md' onPress={onRetry}>
            Try again
          </Button>
        )}
      </Column>
    </View>
  );
};
