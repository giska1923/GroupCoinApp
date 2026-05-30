import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Activity as ActivityIcon } from 'lucide-react-native';
import { useTheme } from '../../../src/theme/ThemeProvider';
import { Screen } from '../../../src/components/layout/Screen';
import { Header } from '../../../src/components/layout/Header';
import { Section } from '../../../src/components/layout/Section';
import { Column } from '../../../src/components/layout/Row';
import { Typography, Card, Avatar, Amount } from '../../../src/components/ui';
import {
  Spinner,
  EmptyState,
  ErrorState,
} from '../../../src/components/feedback';
import { useAllActivity } from '../../../src/hooks';
import { formatActivity, formatDateGroup } from '../../../src/utils/format';
import type { ActivityDTO } from '../../../src/types/api';

export default function ActivityScreen() {
  const theme = useTheme();
  const { activity, isLoading, isError, refetch } = useAllActivity();

  const sections = useMemo(() => {
    const map = new Map<string, ActivityDTO[]>();
    activity.forEach(item => {
      const key = formatDateGroup(item.createdAt);
      const list = map.get(key) ?? [];
      list.push(item);
      map.set(key, list);
    });
    return Array.from(map.entries()).map(([title, items]) => ({ title, items }));
  }, [activity]);

  return (
    <Screen variant='scroll' padding='none' onRefresh={refetch}>
      <View style={{ paddingHorizontal: theme.spacing.lg }}>
        <Header title='Activity' leading='none' align='left' />
      </View>

      {isLoading ? (
        <Spinner fill />
      ) : isError && activity.length === 0 ? (
        <ErrorState error={new Error('Could not load activity')} onRetry={refetch} />
      ) : activity.length === 0 ? (
        <EmptyState
          title='No activity yet'
          message='Expenses and settlements across your groups will appear here.'
          icon={<ActivityIcon size={48} color={theme.colors.text.muted} />}
        />
      ) : (
        <Column
          gap='xl'
          style={{
            paddingHorizontal: theme.spacing.lg,
            paddingBottom: theme.spacing['6xl'],
          }}
        >
          {sections.map(section => (
            <Section key={section.title} title={section.title} spacing='sm'>
              <Card variant='default' padding='none'>
                {section.items.map((item, index) => {
                  const copy = formatActivity(item);
                  return (
                    <View
                      key={item.id}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: theme.spacing.md,
                        padding: theme.spacing.lg,
                        borderBottomWidth:
                          index < section.items.length - 1 ? 1 : 0,
                        borderBottomColor: theme.colors.surface.border,
                      }}
                    >
                      <Avatar
                        size='sm'
                        initials={copy.actor.slice(0, 1)}
                        backgroundColor={theme.colors.brand[600]}
                      />
                      <View style={{ flex: 1 }}>
                        <Typography variant='body' color='primary'>
                          <Typography variant='body' weight='semibold'>
                            {copy.actor}
                          </Typography>{' '}
                          {copy.action}
                          {copy.target ? (
                            <>
                              {' '}
                              <Typography variant='body' weight='semibold'>
                                {copy.target}
                              </Typography>
                            </>
                          ) : null}
                        </Typography>
                      </View>
                      {copy.amount !== undefined && (
                        <Amount value={copy.amount} variant='small' showSign={false} />
                      )}
                    </View>
                  );
                })}
              </Card>
            </Section>
          ))}
        </Column>
      )}
    </Screen>
  );
}
