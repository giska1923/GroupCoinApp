import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Plus, Bell } from 'lucide-react-native';
import { useTheme } from '../../../src/theme/ThemeProvider';
import { Screen } from '../../../src/components/layout/Screen';
import { Section } from '../../../src/components/layout/Section';
import { Row, Column } from '../../../src/components/layout/Row';
import {
  Typography,
  Card,
  Button,
  Amount,
  GroupAvatar,
  Avatar,
} from '../../../src/components/ui';

export default function GroupsScreen() {
  const theme = useTheme();

  // Mock data based on screenshot
  const netFlow = 124050; // $1,240.50 in cents
  const youAreOwed = 142000; // $1,420 in cents

  const popularGroups = [
    { id: '1', name: 'Roommates', memberCount: 4, status: 'active' as const },
    { id: '2', name: 'Tokyo Trip', memberCount: 6, status: 'active' as const },
    { id: '3', name: 'Work Lunch', memberCount: 8, status: 'pending' as const },
  ];

  const recentActivity = [
    {
      id: '1',
      description: 'Dinner at Nobu',
      amount: 5100, // $51.00
      user: 'Alex',
      avatar: 'A',
      type: 'positive' as const,
    },
    {
      id: '2',
      description: 'Dinner at Nobu',
      amount: -1830, // -$18.30
      user: 'You',
      avatar: '🍜',
      type: 'negative' as const,
    },
  ];

  return (
    <Screen variant='scroll' padding='none'>
      {/* Header with title and notification */}
      <View
        style={{
          paddingHorizontal: theme.spacing.lg,
          paddingTop: theme.spacing.md,
          paddingBottom: theme.spacing.xl,
        }}
      >
        <Row
          justify='space-between'
          align='center'
          style={{ marginBottom: theme.spacing.xl }}
        >
          <Typography variant='title' color='primary' weight='semibold'>
            Equinox Flow
          </Typography>

          <TouchableOpacity>
            <Bell size={24} color={theme.colors.text.secondary} />
          </TouchableOpacity>
        </Row>

        {/* Net Flow Card */}
        <Card variant='elevated' padding='lg' style={{ alignItems: 'center' }}>
          <Typography
            variant='caption'
            color='secondary'
            style={{ marginBottom: theme.spacing.sm }}
          >
            Net Flow
          </Typography>

          <Amount
            value={netFlow}
            variant='display'
            type='positive'
            showSign={true}
          />

          <Typography
            variant='caption'
            color='secondary'
            style={{ marginTop: theme.spacing.sm }}
          >
            You are owed:{' '}
            <Amount value={youAreOwed} variant='small' showSign={false} />
          </Typography>
        </Card>
      </View>

      {/* Popular Groups */}
      <Section
        title='Popular Groups'
        showSeeAll={true}
        onSeeAllPress={() => console.log('See all groups')}
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
          {popularGroups.map(group => (
            <GroupAvatar
              key={group.id}
              name={group.name}
              memberCount={group.memberCount}
              status={group.status}
              size='lg'
              onPress={() => console.log(`Navigate to ${group.name}`)}
            />
          ))}
        </ScrollView>
      </Section>

      {/* Recent Activity */}
      <Section
        title='Recent Activity'
        showSeeAll={true}
        onSeeAllPress={() => console.log('See all activity')}
        style={{
          paddingHorizontal: theme.spacing.lg,
          paddingBottom: theme.spacing['6xl'], // Extra padding for FAB
        }}
      >
        <Column gap='sm'>
          {recentActivity.map(activity => (
            <Card key={activity.id} variant='default' padding='md'>
              <Row justify='space-between' align='center'>
                <Row gap='md' style={{ flex: 1 }}>
                  <Avatar
                    size='sm'
                    initials={activity.avatar}
                    backgroundColor={theme.colors.brand[600]}
                  />

                  <Column gap='xs' style={{ flex: 1 }}>
                    <Typography variant='body' color='primary' weight='medium'>
                      {activity.description}
                    </Typography>
                    <Typography variant='caption' color='secondary'>
                      Added by {activity.user}
                    </Typography>
                  </Column>
                </Row>

                <Amount
                  value={activity.amount}
                  variant='default'
                  type={activity.type}
                />
              </Row>
            </Card>
          ))}
        </Column>
      </Section>

      {/* Floating Action Button */}
      <View
        style={{
          position: 'absolute',
          bottom: theme.spacing['3xl'],
          right: theme.spacing.lg,
        }}
      >
        <Button
          variant='primary'
          size='fab'
          icon={<Plus size={24} color={theme.colors.text.primary} />}
          onPress={() => console.log('Add expense')}
        />
      </View>
    </Screen>
  );
}