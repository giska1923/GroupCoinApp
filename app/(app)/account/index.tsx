import React, { useState } from 'react';
import { View } from 'react-native';
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

export default function AccountScreen() {
  const theme = useTheme();
  const [notifications, setNotifications] = useState(true);

  return (
    <Screen variant='scroll' padding='none'>
      <View style={{ paddingHorizontal: theme.spacing.lg }}>
        <Header title='Profile & Account' leading='none' align='center' />
      </View>

      {/* Profile */}
      <Column align='center' gap='md' style={{ paddingVertical: theme.spacing.xl }}>
        <Avatar
          size='xl'
          initials='MC'
          backgroundColor={theme.colors.brand[600]}
          showStatusRing
          statusRingColor='accent'
        />
        <Column align='center' gap='xs'>
          <Typography variant='heading' weight='semibold'>
            Michael Chen
          </Typography>
          <Typography variant='caption' color='secondary'>
            michael.chen@example.com
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
          onPress={() => {}}
        >
          Sign Out
        </Button>
      </Column>
    </Screen>
  );
}
