import React, { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import {
  CreditCard,
  Bell,
  Upload,
  Shield,
  Users,
  LogOut,
} from 'lucide-react-native';
import { useTheme } from '../../../src/theme/ThemeProvider';
import { Screen } from '../../../src/components/layout/Screen';
import { Header } from '../../../src/components/layout/Header';
import { Column } from '../../../src/components/layout/Row';
import {
  Typography,
  Card,
  Avatar,
  Button,
  ListItem,
  Switch,
} from '../../../src/components/ui';
import { useCurrentUser, useLogout } from '../../../src/hooks';
import { useAuthStore } from '../../../src/stores/auth.store';

const initialsOf = (name?: string) =>
  (name ?? '')
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';

export default function AccountScreen() {
  const theme = useTheme();
  const [notifications, setNotifications] = useState(true);

  const storedUser = useAuthStore(s => s.user);
  const { data: fetchedUser } = useCurrentUser();
  const user = fetchedUser ?? storedUser;
  const logout = useLogout();

  const handleSignOut = async () => {
    await logout();
    router.replace('/(auth)/welcome');
  };

  return (
    <Screen variant='scroll' padding='none'>
      <View style={{ paddingHorizontal: theme.spacing.lg }}>
        <Header title='Profile & Account' leading='none' align='center' />
      </View>

      {/* Profile */}
      <Column align='center' gap='md' style={{ paddingVertical: theme.spacing.xl }}>
        <Avatar
          size='xl'
          initials={initialsOf(user?.name)}
          backgroundColor={theme.colors.brand[600]}
          showStatusRing
          statusRingColor='accent'
        />
        <Column align='center' gap='xs'>
          <Typography variant='heading' weight='semibold'>
            {user?.name ?? 'Your account'}
          </Typography>
          <Typography variant='caption' color='secondary'>
            {user?.email ?? ''}
          </Typography>
        </Column>
      </Column>

      <Column gap='lg' style={{ paddingHorizontal: theme.spacing.lg }}>
        {/* Settings group */}
        <Card variant='default' padding='none'>
          <ListItem
            title='Payment Methods'
            leading={<CreditCard size={20} color={theme.colors.brand[400]} />}
            onPress={() => {}}
            divider
          />
          <ListItem
            title='Group Notifications'
            leading={<Bell size={20} color={theme.colors.brand[400]} />}
            trailing={
              <Switch value={notifications} onValueChange={setNotifications} />
            }
            divider
          />
          <ListItem
            title='Privacy & Security'
            leading={<Shield size={20} color={theme.colors.brand[400]} />}
            onPress={() => {}}
            divider
          />
          <ListItem
            title='Export Data'
            leading={<Upload size={20} color={theme.colors.brand[400]} />}
            onPress={() => {}}
          />
        </Card>

        {/* Total friends */}
        <Card variant='default' padding='none'>
          <ListItem
            title='Total Friends'
            subtitle='Manage people you split with'
            leading={<Users size={20} color={theme.colors.brand[400]} />}
            trailing={
              <Typography variant='subheading' weight='semibold' color='accent'>
                24
              </Typography>
            }
            onPress={() => {}}
          />
        </Card>

        <Button
          variant='outline'
          size='lg'
          fullWidth
          textColor={theme.colors.financialNegative}
          icon={<LogOut size={20} color={theme.colors.financialNegative} />}
          style={{ borderColor: theme.colors.financialNegative }}
          onPress={handleSignOut}
        >
          Sign Out
        </Button>
      </Column>
    </Screen>
  );
}
