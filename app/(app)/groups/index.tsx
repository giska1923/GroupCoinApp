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
  Button,
} from '../../../src/components/ui';
import {
  Spinner,
  EmptyState,
  ErrorState,
} from '../../../src/components/feedback';
import { InvitationBell } from '../../../src/components/groups/InvitationsInbox';
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

  const netFlowType = isPositiveAmount(netFlow)
    ? 'positive'
    : isNegativeAmount(netFlow)
      ? 'negative'
      : 'neutral';

  // Darker neutral fill + subtle neutral border, lifted by our signature soft
  // purple glow (same recipe as the Settle Up / Add expense buttons).
  // NOTE: the fill is OPAQUE (not translucent) so the elevation shadow can't
  // bleed through as a dark inner rectangle — it reads identically over the
  // near-black screen.
  const groupButtonStyle = {
    backgroundColor: 'rgb(20, 20, 26)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    shadowColor: theme.colors.brand[400],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 12,
    elevation: 8,
  } as const;

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
          ) : (
            <Amount
              value={netFlow}
              variant='hero'
              type={netFlowType}
              showSign
              glow={!isZeroAmount(netFlow)}
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
              <Button
                key={group.id}
                variant='secondary'
                size='lg'
                fullWidth
                textColor={theme.colors.text.primary}
                textWeight='bold'
                textStyle={{ fontSize: theme.fontSize['2xl'] }}
                style={{
                  ...groupButtonStyle,
                  // Match the card size & shape used on the Expenses/Group screens.
                  height: 104,
                  borderRadius: theme.components.card.radius,
                }}
                onPress={() => router.push(`/(app)/groups/${group.id}`)}
              >
                {group.name}
              </Button>
            ))}
          </View>
        </Section>
      )}
    </Screen>
  );
}
