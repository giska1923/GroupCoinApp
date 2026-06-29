import React, { useState } from 'react';
import { router } from 'expo-router';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { useTheme } from '../../src/theme/ThemeProvider';
import { Screen } from '../../src/components/layout/Screen';
import { Header } from '../../src/components/layout/Header';
import { Column } from '../../src/components/layout/Row';
import { Typography, TextField, Button } from '../../src/components/ui';
import { useLogin } from '../../src/hooks';
import { ClientError } from '../../src/api/errors';
import { GoogleSignInButton } from '../../src/components/auth/GoogleSignInButton';

export default function LoginScreen() {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const login = useLogin();

  const errorMessage =
    login.error instanceof ClientError
      ? login.error.message
      : login.error
        ? 'Could not sign in. Please try again.'
        : undefined;

  const handleSubmit = () => {
    const trimmedEmail = email.trim();
    login.mutate(
      { email: trimmedEmail, password },
      {
        onSuccess: () => router.replace('/(app)/groups'),
        onError: error => {
          // The account exists with the right password but isn't verified yet.
          // The backend has re-sent a code, so route to the verify screen.
          if (
            error instanceof ClientError &&
            error.code === 'EMAIL_NOT_VERIFIED'
          ) {
            router.push({
              pathname: '/(auth)/verify-email',
              params: { email: trimmedEmail },
            });
          }
        },
      },
    );
  };

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

        {errorMessage && (
          <Typography variant='caption' color='negative'>
            {errorMessage}
          </Typography>
        )}

        <Button
          variant='primary'
          size='lg'
          fullWidth
          loading={login.isPending}
          disabled={!email.trim() || !password}
          onPress={handleSubmit}
        >
          Sign In
        </Button>

        <Typography
          variant='caption'
          color='secondary'
          style={{ textAlign: 'center' }}
        >
          or
        </Typography>

        <GoogleSignInButton
          onSuccess={() => router.replace('/(app)/groups')}
        />

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
