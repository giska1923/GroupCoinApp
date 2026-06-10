import React from 'react';
import { Users } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '../../../src/theme/ThemeProvider';
import { Screen } from '../../../src/components/layout/Screen';
import { Header } from '../../../src/components/layout/Header';
import { Column } from '../../../src/components/layout/Row';
import { Typography, Card, Avatar, ListItem } from '../../../src/components/ui';
import {
  Spinner,
  EmptyState,
  ErrorState,
} from '../../../src/components/feedback';
import { useSplitContacts } from '../../../src/hooks';

const initialsOf = (name?: string) =>
  (name ?? '')
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';

const formatGroupNames = (groupNames: string[]) => {
  if (groupNames.length <= 2) return groupNames.join(', ');
  return `${groupNames.slice(0, 2).join(', ')} +${groupNames.length - 2} more`;
};

export default function FriendsScreen() {
  const theme = useTheme();
  const { contacts, isLoading, isError, refetch } = useSplitContacts();

  const close = () => {
    if (router.canGoBack()) router.back();
  };

  return (
    <Screen variant='scroll' padding='lg' edges={['top', 'left', 'right']} onRefresh={refetch}>
      <Header title='Total Friends' leading='back' onLeadingPress={close} />

      {isLoading ? (
        <Spinner fill />
      ) : isError && contacts.length === 0 ? (
        <ErrorState error={new Error('Could not load friends')} onRetry={refetch} />
      ) : contacts.length === 0 ? (
        <EmptyState
          title='No friends yet'
          message='People you share groups with will appear here.'
          icon={<Users size={48} color={theme.colors.text.muted} />}
        />
      ) : (
        <Column gap='md'>
          <Typography variant='caption' color='secondary'>
            {contacts.length} {contacts.length === 1 ? 'person' : 'people'} you split with
          </Typography>

          <Card variant='default' padding='none'>
            {contacts.map((contact, index) => (
              <ListItem
                key={contact.id}
                title={contact.name}
                subtitle={
                  contact.groupNames.length > 0
                    ? formatGroupNames(contact.groupNames)
                    : contact.email
                }
                leading={
                  <Avatar
                    size='sm'
                    initials={initialsOf(contact.name)}
                    backgroundColor={theme.colors.brand[900]}
                  />
                }
                divider={index < contacts.length - 1}
              />
            ))}
          </Card>
        </Column>
      )}
    </Screen>
  );
}
