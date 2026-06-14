import React, { useState } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import {
  Bell,
  Shield,
  MessageSquare,
  Users,
  LogOut,
  EllipsisVertical,
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
import { AccountMenuSheet } from '../../../src/components/account/AccountMenuSheet';
import { EditAccountSheet } from '../../../src/components/account/EditAccountSheet';
import { PrivacySecuritySheet } from '../../../src/components/account/PrivacySecuritySheet';
import { SupportFeedbackSheet } from '../../../src/components/account/SupportFeedbackSheet';
import {
  useCurrentUser,
  useLogout,
  useSplitContacts,
  useDeleteUser,
} from '../../../src/hooks';
import { useAuthStore } from '../../../src/stores/auth.store';
import { ClientError } from '../../../src/api/errors';

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const storedUser = useAuthStore(s => s.user);
  const { data: fetchedUser } = useCurrentUser();
  const user = fetchedUser ?? storedUser;
  const logout = useLogout();
  const deleteUser = useDeleteUser();
  const { count: friendCount, isLoading: friendsLoading } = useSplitContacts();

  const accountActionLoading = deleteUser.isPending;

  const handleSignOut = async () => {
    await logout();
    router.replace('/(auth)/welcome');
  };

  const showActionError = (error: unknown, fallback: string) => {
    Alert.alert(
      'Something went wrong',
      error instanceof ClientError ? error.message : fallback,
    );
  };

  const handleEdit = () => {
    setMenuOpen(false);
    setEditOpen(true);
  };

  const confirmDelete = () => {
    setMenuOpen(false);

    Alert.alert(
      'Delete account?',
      'This permanently deletes your account and signs you out.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () =>
            deleteUser.mutate(undefined, {
              onSuccess: async () => {
                await logout();
                router.replace('/(auth)/welcome');
              },
              onError: error =>
                showActionError(error, 'Could not delete your account.'),
            }),
        },
      ],
    );
  };

  return (
    <Screen variant='scroll' padding='none'>
      <View style={{ paddingHorizontal: theme.spacing.lg }}>
        <Header
          title='Profile & Account'
          leading='none'
          align='center'
          right={
            <TouchableOpacity
              onPress={() => setMenuOpen(true)}
              hitSlop={8}
              style={{
                width: 40,
                height: 40,
                borderRadius: theme.radius.full,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.colors.surface.secondary,
              }}
            >
              <EllipsisVertical
                size={22}
                color={theme.colors.text.secondary}
              />
            </TouchableOpacity>
          }
        />
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
            onPress={() => setPrivacyOpen(true)}
            divider
          />
          <ListItem
            title='Support & Feedback'
            leading={<MessageSquare size={20} color={theme.colors.brand[400]} />}
            onPress={() => setFeedbackOpen(true)}
          />
        </Card>

        {/* Total friends */}
        <Card variant='default' padding='none'>
          <ListItem
            title='Total Friends'
            subtitle='Manage people you split with'
            leading={<Users size={20} color={theme.colors.brand[400]} />}
            trailing={
              !friendsLoading ? (
                <Typography variant='subheading' weight='semibold' color='accent'>
                  {friendCount}
                </Typography>
              ) : undefined
            }
            onPress={() => router.push('/(app)/account/friends')}
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

      <AccountMenuSheet
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        onEdit={handleEdit}
        onDelete={confirmDelete}
        loading={accountActionLoading}
      />

      <EditAccountSheet
        visible={editOpen}
        onClose={() => setEditOpen(false)}
        currentName={user?.name}
      />

      <PrivacySecuritySheet
        visible={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
      />

      <SupportFeedbackSheet
        visible={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />
    </Screen>
  );
}
