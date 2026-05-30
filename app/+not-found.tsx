import React from 'react';
import { Stack, router } from 'expo-router';
import { Compass } from 'lucide-react-native';
import { useTheme } from '../src/theme/ThemeProvider';
import { Screen } from '../src/components/layout/Screen';
import { Column } from '../src/components/layout/Row';
import { Typography, Button } from '../src/components/ui';

export default function NotFoundScreen() {
  const theme = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!', headerShown: false }} />
      <Screen variant='fixed' padding='lg' edges={['top', 'bottom', 'left', 'right']}>
        <Column justify='center' align='center' gap='lg' style={{ flex: 1 }}>
          <Compass size={56} color={theme.colors.brand[400]} />
          <Column align='center' gap='xs'>
            <Typography variant='heading' weight='semibold'>
              This screen doesn't exist
            </Typography>
            <Typography variant='body' color='secondary' align='center'>
              The page you were looking for could not be found.
            </Typography>
          </Column>
          <Button variant='primary' size='lg' onPress={() => router.replace('/')}>
            Go to home
          </Button>
        </Column>
      </Screen>
    </>
  );
}
