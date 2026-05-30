import React from 'react';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Coins, LogIn, UserPlus } from 'lucide-react-native';
import { useTheme } from '../../src/theme/ThemeProvider';
import { Screen } from '../../src/components/layout/Screen';
import { Column } from '../../src/components/layout/Row';
import { Typography, Button } from '../../src/components/ui';

export default function WelcomeScreen() {
  const theme = useTheme();

  return (
    <Screen
      variant='fixed'
      padding='lg'
      edges={['top', 'bottom', 'left', 'right']}
    >
      <Column justify='center' align='center' gap='xl' style={{ flex: 1 }}>
        {/* Logo and Title */}
        <Column align='center' gap='lg'>
          <Coins size={64} color={theme.colors.brand[400]} />
          <Typography variant='display' color='primary' weight='bold'>
            GroupCoin
          </Typography>
          <Typography
            variant='subheading'
            color='secondary'
            style={{ textAlign: 'center', maxWidth: 280 }}
          >
            Split expenses with friends and family
          </Typography>
        </Column>

        {/* Buttons */}
        <Column gap='md' style={{ width: '100%' }}>
          <Button
            variant='primary'
            size='lg'
            fullWidth
            icon={<LogIn size={20} color={theme.colors.text.primary} />}
            iconPosition='left'
            onPress={() => router.push('/(auth)/login')}
          >
            Sign In
          </Button>

          <Button
            variant='outline'
            size='lg'
            fullWidth
            icon={<UserPlus size={20} color={theme.colors.brand[500]} />}
            iconPosition='left'
            onPress={() => router.push('/(auth)/register')}
          >
            Create Account
          </Button>
        </Column>
      </Column>
    </Screen>
  );
}
