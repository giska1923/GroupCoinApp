import React from 'react';
import { View } from 'react-native';
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
} from '../../../src/components/ui';
import {
  Spinner,
  EmptyState,
  ErrorState,
} from '../../../src/components/feedback';
import { InvitationBell } from '../../../src/components/groups/InvitationsInbox';
import { GroupCard } from '../../../src/components/groups/GroupCard';
import { useOverview, useInvitations } from '../../../src/hooks';
import { isNegativeAmount, isPositiveAmount, isZeroAmount } from '../../../src/utils/money';

export default function GroupsScreen() {
  const theme = useTheme();
  const {
    groups,
    groupsQuery,
    netFlow,
    owedToYou,
    youOwe,
    isLoadingBalances,
  } = useOverview();
  const invitations = useInvitations();
  const invitationCount = invitations.data?.length ?? 0;

  // netFlow holds one entry per currency; a single entry gets the hero
  // treatment, several entries render stacked so currencies are never summed.
  // Fallback guards against an unexpectedly empty array (e.g. mid hot-reload).
  const primaryNetFlow = netFlow[0] ?? { currency: 'USD', amount: '0.00' };
  const netFlowType = isPositiveAmount(primaryNetFlow.amount)
    ? 'positive'
    : isNegativeAmount(primaryNetFlow.amount)
      ? 'negative'
      : 'neutral';

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
            style={{ marginBottom: theme.spacing.sm, opacity: 0.8 }}
          >
            Net Flow
          </Typography>
          {isLoadingBalances ? (
            <Spinner size='small' />
          ) : netFlow.length === 1 ? (
            <Amount
              value={primaryNetFlow.amount}
              currency={primaryNetFlow.currency}
              variant='hero'
              type={netFlowType}
              showSign
              glow={!isZeroAmount(primaryNetFlow.amount)}
            />
          ) : (
            <View style={{ alignItems: 'center', gap: theme.spacing.xs }}>
              {netFlow.map(entry => (
                <Amount
                  key={entry.currency}
                  value={entry.amount}
                  currency={entry.currency}
                  variant='displayLg'
                  showSign
                  glow={!isZeroAmount(entry.amount)}
                />
              ))}
            </View>
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
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  alignItems: 'baseline',
                  gap: 6,
                }}
              >
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
                {youOwe.map(entry => (
                  <Amount
                    key={entry.currency}
                    value={entry.amount}
                    currency={entry.currency}
                    variant='detail'
                    type='negativeMuted'
                    showSign={false}
                  />
                ))}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  alignItems: 'baseline',
                  gap: 6,
                }}
              >
                <Typography variant='subheading' color='positiveMuted' weight='medium'>
                  You are owed:
                </Typography>
                {owedToYou.map(entry => (
                  <Amount
                    key={entry.currency}
                    value={entry.amount}
                    currency={entry.currency}
                    variant='detailLg'
                    type='positiveMuted'
                    showSign={false}
                  />
                ))}
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
        <Section
          title='Your Groups'
          style={{
            paddingHorizontal: theme.spacing.lg,
            paddingTop: theme.spacing.xl,
            paddingBottom: theme.spacing.lg,
          }}
        >
          <View style={{ gap: theme.spacing.md }}>
            {groups.map(group => (
              <GroupCard
                key={group.id}
                group={group}
                onPress={() => router.push(`/(app)/groups/${group.id}`)}
              />
            ))}
          </View>
        </Section>
      )}
    </Screen>
  );
}
