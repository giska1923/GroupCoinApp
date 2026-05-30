import React from 'react';
import { View } from 'react-native';
import { Inbox } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Column } from '../layout/Row';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: React.ReactNode;
  action?: { label: string; onPress: () => void };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon,
  action,
}) => {
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
        {icon ?? <Inbox size={48} color={theme.colors.text.muted} />}
        <Column align='center' gap='xs'>
          <Typography variant='subheading' weight='semibold' align='center'>
            {title}
          </Typography>
          {message && (
            <Typography variant='body' color='secondary' align='center'>
              {message}
            </Typography>
          )}
        </Column>
        {action && (
          <Button variant='primary' size='md' onPress={action.onPress}>
            {action.label}
          </Button>
        )}
      </Column>
    </View>
  );
};
