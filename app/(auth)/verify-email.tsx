import React, { useEffect, useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { ShieldCheck } from 'lucide-react-native';
import { useTheme } from '../../src/theme/ThemeProvider';
import { Screen } from '../../src/components/layout/Screen';
import { Header } from '../../src/components/layout/Header';
import { Column } from '../../src/components/layout/Row';
import { Typography, TextField, Button } from '../../src/components/ui';
import { useVerifyEmail, useResendVerification } from '../../src/hooks';
import { ClientError } from '../../src/api/errors';

const CODE_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 30;

export default function VerifyEmailScreen() {
  const theme = useTheme();
  const { email: emailParam } = useLocalSearchParams<{ email?: string }>();
  const email = (emailParam ?? '').trim();

  const [code, setCode] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [resentMessage, setResentMessage] = useState<string | undefined>();

  const verify = useVerifyEmail();
  const resend = useResendVerification();

  // Tick down the resend cooldown once per second while it's active.
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown(c => Math.max(0, c - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const verifyError =
    verify.error instanceof ClientError
      ? verify.error.message
      : verify.error
        ? 'Could not verify the code. Please try again.'
        : undefined;

  const canSubmit = code.length === CODE_LENGTH && email.length > 0;

  const handleVerify = () => {
    if (!canSubmit) return;
    verify.mutate(
      { email, code },
      { onSuccess: () => router.replace('/(app)/groups') },
    );
  };

  // Auto-submit once the full code is entered, so the user rarely needs the
  // button — but the button stays for explicit retries.
  const submittedFor = useRef<string | null>(null);
  useEffect(() => {
    if (code.length === CODE_LENGTH && submittedFor.current !== code) {
      submittedFor.current = code;
      handleVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const handleResend = () => {
    if (cooldown > 0 || !email) return;
    setResentMessage(undefined);
    resend.mutate(
      { email },
      {
        onSuccess: () => {
          setCode('');
          submittedFor.current = null;
          setCooldown(RESEND_COOLDOWN_SECONDS);
          setResentMessage(`We sent a new code to ${email}.`);
        },
      },
    );
  };

  return (
    <Screen variant='scroll' padding='lg' edges={['top', 'bottom', 'left', 'right']}>
      <Header title='Verify Email' />

      <Column gap='xl' style={{ paddingTop: theme.spacing['2xl'] }}>
        <Column gap='md' style={{ alignItems: 'center' }}>
          <ShieldCheck size={48} color={theme.colors.brand[500]} />
          <Column gap='xs' style={{ alignItems: 'center' }}>
            <Typography variant='title' weight='bold'>
              Check your email
            </Typography>
            <Typography
              variant='body'
              color='secondary'
              style={{ textAlign: 'center' }}
            >
              {email
                ? `We sent a ${CODE_LENGTH}-digit code to ${email}. Enter it below to finish creating your account.`
                : `Enter the ${CODE_LENGTH}-digit code we emailed you to finish creating your account.`}
            </Typography>
          </Column>
        </Column>

        <TextField
          label='Verification code'
          placeholder='••••••'
          keyboardType='number-pad'
          textContentType='oneTimeCode'
          autoComplete='one-time-code'
          maxLength={CODE_LENGTH}
          value={code}
          onChangeText={t => setCode(t.replace(/[^0-9]/g, ''))}
          error={verifyError}
        />

        {resentMessage && !verifyError && (
          <Typography variant='caption' color='secondary'>
            {resentMessage}
          </Typography>
        )}

        <Button
          variant='primary'
          size='lg'
          fullWidth
          loading={verify.isPending}
          disabled={!canSubmit}
          onPress={handleVerify}
        >
          Verify & Continue
        </Button>

        <Button
          variant='ghost'
          size='md'
          fullWidth
          loading={resend.isPending}
          disabled={cooldown > 0 || resend.isPending}
          onPress={handleResend}
        >
          {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
        </Button>

        <Button
          variant='ghost'
          size='md'
          fullWidth
          onPress={() => router.replace('/(auth)/login')}
        >
          Use a different account
        </Button>
      </Column>
    </Screen>
  );
}
