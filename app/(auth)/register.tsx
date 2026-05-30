import React, { useState } from 'react';
import { router } from 'expo-router';
import { User, Mail, Lock } from 'lucide-react-native';
import { useTheme } from '../../src/theme/ThemeProvider';
import { Screen } from '../../src/components/layout/Screen';
import { Header } from '../../src/components/layout/Header';
import { Column } from '../../src/components/layout/Row';
import { Typography, TextField, Button } from '../../src/components/ui';

export default function RegisterScreen() {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Screen variant='scroll' padding='lg' edges={['top', 'bottom', 'left', 'right']}>
      <Header title='Create Account' />

      <Column gap='xl' style={{ paddingTop: theme.spacing['2xl'] }}>
        <Column gap='xs'>
          <Typography variant='title' weight='bold'>
            Join GroupCoin
          </Typography>
          <Typography variant='body' color='secondary'>
            Split expenses fairly with friends and family.
          </Typography>
        </Column>

        <Column gap='lg'>
          <TextField
            label='Full name'
            placeholder='Michael Chen'
            value={name}
            onChangeText={setName}
            leftIcon={<User size={18} color={theme.colors.text.muted} />}
          />
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
            placeholder='At least 8 characters'
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            leftIcon={<Lock size={18} color={theme.colors.text.muted} />}
          />
        </Column>

        <Button
          variant='primary'
          size='lg'
          fullWidth
          onPress={() => router.replace('/(app)/groups')}
        >
          Create Account
        </Button>

        <Button
          variant='ghost'
          size='md'
          fullWidth
          onPress={() => router.push('/(auth)/login')}
        >
          Already have an account? Sign in
        </Button>
      </Column>
    </Screen>
  );
}
