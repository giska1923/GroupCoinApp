import React from 'react';
import { ScrollView, useWindowDimensions } from 'react-native';
import { Sheet, Button, Typography } from '../ui';
import { Column } from '../layout/Row';
import { useTheme } from '../../theme/ThemeProvider';

const LAST_UPDATED = 'June 14, 2026';

const SECTIONS = [
  {
    title: 'Overview',
    body: [
      'GroupCoin is a group expense-sharing app that helps you split bills, track balances, and settle up with friends, roommates, and travel groups.',
      'GroupCoin stores the information needed for the app to work — your account details, shared group data, expenses, settlements, and activity — primarily on GroupCoin servers so your groups stay in sync across devices. Your sign-in session is stored securely on your device.',
    ],
  },
  {
    title: 'Information stored on your device',
    bullets: [
      'Your sign-in token and basic profile information (stored in encrypted device storage)',
      'Temporary cached copies of groups, expenses, balances, and activity while you use the app',
      'App preferences such as theme and on-screen settings',
    ],
    body: [
      'Cached data is used to make the app responsive. It is not the primary copy of your account or group information.',
    ],
  },
  {
    title: 'Information stored on GroupCoin servers',
    bullets: [
      'Account details: name, email address, optional contact information, and a securely hashed password',
      'Groups you create or join, including group names, descriptions, and currency settings',
      'Group membership, roles, and invitations (including invitee email addresses)',
      'Expenses, splits, settlements, balances, and activity history within your groups',
      'Support and feedback messages you choose to send through the app',
    ],
    body: [
      'This server-side storage is what allows your shared groups to stay up to date and accessible when you sign in on a new device.',
    ],
  },
  {
    title: 'Information shared with other users',
    body: [
      'GroupCoin is designed for shared financial tracking. When you participate in a group, other members of that group can see information relevant to that group, such as your name, email address, and expenses, splits, settlements, balances, and activity within the group.',
      'Only people in your groups (or people you invite to join) can see group-related information. GroupCoin does not make your data publicly searchable.',
    ],
  },
  {
    title: 'What GroupCoin does not collect',
    bullets: [
      'Your phone’s contact list',
      'Precise location data',
      'Health or medical records',
      'Payment card numbers, bank account details, or other payment credentials',
    ],
    body: [
      'GroupCoin helps you record who owes what. It does not process real-world payments between users.',
      'We do not sell your personal information or use advertising trackers that follow you across other apps or websites.',
    ],
  },
  {
    title: 'Permissions',
    bullets: [
      'Secure storage — used to keep your sign-in session protected on your device using platform security features such as the iOS Keychain and Android encrypted storage.',
      'Network access — required to sign in, sync your groups, and receive real-time updates such as group invitations.',
    ],
    body: [
      'GroupCoin does not request access to your photo library, camera, microphone, contacts, or location for normal use.',
      'Notifications — if enabled in a future version, notifications would be used only for group-related alerts you choose to receive, such as invitations or activity updates. Notification preferences can be managed from your device settings.',
    ],
  },
  {
    title: 'How your data is protected',
    bullets: [
      'Your sign-in session is stored on your device using encrypted platform storage.',
      'Communication between the app and GroupCoin servers uses secure connections over HTTPS.',
      'Passwords are not stored in plain text on your device. On our servers, passwords are handled using industry-standard secure hashing practices.',
    ],
    body: [
      'For the best security, keep your device updated, use a strong device passcode, and choose a unique password for your GroupCoin account.',
    ],
  },
  {
    title: 'Your control over data',
    bullets: [
      'You can update your profile information, such as your name, email, or optional contact details, from your account settings.',
      'You can sign out at any time, which removes your local sign-in session from your device.',
      'You can manage your participation in groups by leaving groups, editing group details where permitted, or removing expenses and settlements according to your role in each group.',
      'If you send feedback through Support & Feedback, that message is stored so we can review and respond to it.',
    ],
    body: [
      'Removing the app from your device clears locally stored session and cached data. Your account and group data on GroupCoin servers remain unless you request account deletion or take other account-management steps described in future updates to this document.',
    ],
  },
  {
    title: 'Children',
    body: [
      'GroupCoin is not intended for children under 13 years old.',
      'We do not knowingly collect personal information from children.',
    ],
  },
  {
    title: 'Changes to this document',
    body: [
      'This Privacy & Security document may be updated as GroupCoin evolves and new features are added.',
      'The "Last updated" date reflects the latest version.',
    ],
  },
  {
    title: 'Contact',
    body: [
      'If you have questions about privacy or security, contact us through the Support & Feedback section inside the app.',
    ],
  },
] as const;

interface PrivacySecuritySheetProps {
  visible: boolean;
  onClose: () => void;
}

export const PrivacySecuritySheet: React.FC<PrivacySecuritySheetProps> = ({
  visible,
  onClose,
}) => {
  const theme = useTheme();
  const { height } = useWindowDimensions();
  const scrollMaxHeight = height * 0.55;

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      title='Privacy & Security'
      showClose
    >
      <Column gap='lg'>
        <Typography variant='caption' color='muted'>
          Last updated {LAST_UPDATED}
        </Typography>

        <ScrollView
          style={{ maxHeight: scrollMaxHeight }}
          showsVerticalScrollIndicator
          nestedScrollEnabled
        >
          <Column gap='xl' style={{ paddingBottom: theme.spacing.md }}>
            {SECTIONS.map(section => (
              <Column key={section.title} gap='sm'>
                <Typography variant='subheading' weight='semibold'>
                  {section.title}
                </Typography>

                {'bullets' in section &&
                  section.bullets?.map(item => (
                    <Typography
                      key={item}
                      variant='body'
                      color='secondary'
                      style={{ paddingLeft: theme.spacing.sm }}
                    >
                      {'\u2022'} {item}
                    </Typography>
                  ))}

                {section.body.map(paragraph => (
                  <Typography key={paragraph} variant='body' color='secondary'>
                    {paragraph}
                  </Typography>
                ))}
              </Column>
            ))}
          </Column>
        </ScrollView>

        <Button variant='ghost' size='lg' fullWidth onPress={onClose}>
          Close
        </Button>
      </Column>
    </Sheet>
  );
};
