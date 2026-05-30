import React, { useState } from 'react';
import { router } from 'expo-router';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { useTheme } from '../../src/theme/ThemeProvider';
import { Screen } from '../../src/components/layout/Screen';
import { Header } from '../../src/components/layout/Header';
import { Column } from '../../src/components/layout/Row';
import { Typography, TextField, Button } from '../../src/components/ui';

export default function LoginScreen() {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Screen variant='fixed' padding='lg' edges={['top', 'bottom', 'left', 'right']}>
      <Header title='Sign In' />

      <Column gap='xl' style={{ flex: 1, paddingTop: theme.spacing['2xl'] }}>
        <Column gap='xs'>
          <Typography variant='title' weight='bold'>
            Welcome back
          </Typography>
          <Typography variant='body' color='secondary'>
            Sign in to keep your groups in sync.
          </Typography>
        </Column>

        <Column gap='lg'>
          <TextField
            label='Email'
            placeholder='you@example.com'
            keyboardType='email-address'
            autoCapitalize='none'
            value={email}
            onChangeText={setEmail}
            leftIcon={<Mail size={18} color={theme.colors.text.muted} />}
          />
          <TextField
            label='Password'
            placeholder='••••••••'
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            leftIcon={<Lock size={18} color={theme.colors.text.muted} />}
            rightIcon={
              showPassword ? (
                <EyeOff size={18} color={theme.colors.text.muted} />
              ) : (
                <Eye size={18} color={theme.colors.text.muted} />
              )
            }
            onRightIconPress={() => setShowPassword(v => !v)}
          />
        </Column>

        <Button
          variant='primary'
          size='lg'
          fullWidth
          onPress={() => router.replace('/(app)/groups')}
        >
          Sign In
        </Button>

        <Button
          variant='ghost'
          size='md'
          fullWidth
          onPress={() => router.push('/(auth)/register')}
        >
          Don't have an account? Create one
        </Button>
      </Column>
    </Screen>
  );
}
