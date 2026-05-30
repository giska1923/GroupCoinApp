import React from 'react';
import { View, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Bell, Users } from 'lucide-react-native';
import { useTheme } from '../../../src/theme/ThemeProvider';
import { Screen } from '../../../src/components/layout/Screen';
import { Header } from '../../../src/components/layout/Header';
import { Section } from '../../../src/components/layout/Section';
import {
  Typography,
  Card,
  Amount,
  GroupAvatar,
  ListItem,
} from '../../../src/components/ui';
import {
  Spinner,
  EmptyState,
  ErrorState,
} from '../../../src/components/feedback';
import { useOverview } from '../../../src/hooks';

export default function GroupsScreen() {
  const theme = useTheme();
  const { groups, groupsQuery, netFlowCents, owedToYou, isLoadingBalances } =
    useOverview();

  return (
    <Screen
      variant='scroll'
      padding='none'
      refreshing={groupsQuery.isRefetching}
      onRefresh={() => groupsQuery.refetch()}
    >
      <View style={{ paddingHorizontal: theme.spacing.lg }}>
        <Header
          title='GroupCoin'
          leading='none'
          align='left'
          right={<Bell size={22} color={theme.colors.text.secondary} />}
        />
      </View>

      {/* Net Flow */}
      <View style={{ paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.xl }}>
        <Card variant='elevated' padding='lg' style={{ alignItems: 'center' }}>
          <Typography variant='caption' color='secondary' style={{ marginBottom: theme.spacing.sm }}>
            Net Flow
          </Typography>
          {isLoadingBalances ? (
            <Spinner size='small' />
          ) : (
            <Amount value={netFlowCents} variant='display' showSign />
          )}
          <Typography variant='caption' color='secondary' style={{ marginTop: theme.spacing.sm }}>
            You are owed{' '}
            <Amount value={owedToYou} variant='small' showSign={false} />
          </Typography>
        </Card>
      </View>

      {groupsQuery.isLoading ? (
        <Spinner fill />
      ) : groupsQuery.isError && groups.length === 0 ? (
        <ErrorState error={groupsQuery.error} onRetry={() => groupsQuery.refetch()} />
      ) : groups.length === 0 ? (
        <EmptyState
          title='No groups yet'
          message='Create a group to start splitting expenses with friends.'
          icon={<Users size={48} color={theme.colors.text.muted} />}
          action={{ label: 'Create group', onPress: () => router.push('/(app)/groups/new') }}
        />
      ) : (
        <>
          <Section
            title='Popular Groups'
            style={{ paddingHorizontal: theme.spacing.lg }}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: theme.spacing.sm,
                gap: theme.spacing.lg,
              }}
            >
              {groups.map(group => (
                <GroupAvatar
                  key={group.id}
                  name={group.name}
                  memberCount={group.memberCount}
                  status='active'
                  size='lg'
                  onPress={() => router.push(`/(app)/groups/${group.id}`)}
                />
              ))}
            </ScrollView>
          </Section>

          <Section
            title='Your groups'
            style={{
              paddingHorizontal: theme.spacing.lg,
              paddingTop: theme.spacing.xl,
              paddingBottom: theme.spacing['6xl'],
            }}
          >
            <Card variant='default' padding='none'>
              {groups.map((group, index) => (
                <ListItem
                  key={group.id}
                  title={group.name}
                  subtitle={
                    [
                      group.memberCount != null
                        ? `${group.memberCount} members`
                        : null,
                      group.expenseCount != null
                        ? `${group.expenseCount} expenses`
                        : null,
                    ]
                      .filter(Boolean)
                      .join(' · ') || group.currency
                  }
                  leading={
                    <Typography variant='body' weight='semibold' color='accent'>
                      {group.name.slice(0, 1).toUpperCase()}
                    </Typography>
                  }
                  divider={index < groups.length - 1}
                  onPress={() => router.push(`/(app)/groups/${group.id}`)}
                />
              ))}
            </Card>
          </Section>
        </>
      )}
    </Screen>
  );
}
