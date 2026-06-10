import React from 'react';
import { View, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Users } from 'lucide-react-native';
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
import { InvitationBell } from '../../../src/components/groups/InvitationsInbox';
import { useOverview, useInvitations } from '../../../src/hooks';

export default function GroupsScreen() {
  const theme = useTheme();
  const {
    groups,
    groupsQuery,
    netFlowCents,
    owedToYou,
    youOwe,
    isLoadingBalances,
  } = useOverview();
  const invitations = useInvitations();
  const invitationCount = invitations.data?.length ?? 0;

  const netFlowType =
    netFlowCents > 0 ? 'positive' : netFlowCents < 0 ? 'negative' : 'neutral';

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
          titleTone='brand'
          leading='none'
          align='left'
          right={<InvitationBell count={invitationCount} />}
        />
      </View>

      {/* Net Flow */}
      <View style={{ paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.xl }}>
        <Card
          variant='elevated'
          padding='md'
          style={{
            alignItems: 'center',
            paddingVertical: theme.spacing.lg,
          }}
        >
          <Typography
            variant='subheading'
            color='primary'
            weight='medium'
            align='center'
            style={{ marginBottom: theme.spacing.sm }}
          >
            Net Flow
          </Typography>
          {isLoadingBalances ? (
            <Spinner size='small' />
          ) : (
            <Amount
              value={netFlowCents}
              variant='hero'
              type={netFlowType}
              showSign
              glow={netFlowCents !== 0}
            />
          )}
          {!isLoadingBalances && (
            <View
              style={{
                alignItems: 'center',
                gap: theme.spacing.xs,
                marginTop: theme.spacing.sm,
                width: '100%',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
                <Typography
                  variant='body'
                  color='negativeMuted'
                  weight='medium'
                  style={{
                    fontSize: theme.fontSize.md,
                    lineHeight: theme.fontSize.md * 1.4,
                  }}
                >
                  You owe:
                </Typography>
                <Amount
                  value={youOwe}
                  variant='detail'
                  type='negativeMuted'
                  showSign={false}
                />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
                <Typography variant='subheading' color='positiveMuted' weight='medium'>
                  You are owed:
                </Typography>
                <Amount
                  value={owedToYou}
                  variant='detailLg'
                  type='positiveMuted'
                  showSign={false}
                />
              </View>
            </View>
          )}
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
                gap: theme.spacing.md,
              }}
            >
              {groups.map(group => (
                <Card
                  key={group.id}
                  variant='elevated'
                  padding='md'
                  style={{
                    minWidth: 120,
                    alignItems: 'center',
                  }}
                >
                  <GroupAvatar
                    name={group.name}
                    memberCount={group.memberCount}
                    status='active'
                    size='lg'
                    onPress={() => router.push(`/(app)/groups/${group.id}`)}
                  />
                </Card>
              ))}
            </ScrollView>
          </Section>

          <Section
            title='Your groups'
            style={{
              paddingHorizontal: theme.spacing.lg,
              paddingTop: theme.spacing.xl,
              paddingBottom: theme.spacing.lg,
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
