import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../../src/theme/ThemeProvider';
import { Screen } from '../../../src/components/layout/Screen';
import { Header } from '../../../src/components/layout/Header';
import { Section } from '../../../src/components/layout/Section';
import { Column } from '../../../src/components/layout/Row';
import { Typography, Card, Avatar, Amount } from '../../../src/components/ui';

type ActivityItem = {
  id: string;
  actor: string;
  action: string;
  target: string;
  amount?: number; // cents, signed
};

type ActivitySection = { title: string; items: ActivityItem[] };

export default function ActivityScreen() {
  const theme = useTheme();

  const sections: ActivitySection[] = [
    {
      title: 'Today',
      items: [
        { id: '1', actor: 'Alex', action: 'added', target: 'Dinner at Nobu', amount: 5000 },
        { id: '2', actor: 'You', action: 'settled with', target: 'Bob', amount: -2000 },
      ],
    },
    {
      title: 'Yesterday',
      items: [
        { id: '3', actor: 'You', action: 'added', target: 'Electricity', amount: -8000 },
        { id: '4', actor: 'Charlie', action: 'joined', target: 'Roommates' },
        { id: '5', actor: 'Maria', action: 'updated', target: 'Groceries' },
      ],
    },
  ];

  return (
    <Screen variant='scroll' padding='none'>
      <View style={{ paddingHorizontal: theme.spacing.lg }}>
        <Header title='Activity' leading='none' align='left' />
      </View>

      <Column gap='xl' style={{ paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing['6xl'] }}>
        {sections.map(section => (
          <Section key={section.title} title={section.title} spacing='sm'>
            <Card variant='default' padding='none'>
              {section.items.map((item, index) => (
                <View
                  key={item.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: theme.spacing.md,
                    padding: theme.spacing.lg,
                    borderBottomWidth: index < section.items.length - 1 ? 1 : 0,
                    borderBottomColor: theme.colors.surface.border,
                  }}
                >
                  <Avatar
                    size='sm'
                    initials={item.actor.slice(0, 1)}
                    backgroundColor={theme.colors.brand[600]}
                  />
                  <View style={{ flex: 1 }}>
                    <Typography variant='body' color='primary'>
                      <Typography variant='body' weight='semibold'>
                        {item.actor}
                      </Typography>{' '}
                      {item.action}{' '}
                      <Typography variant='body' weight='semibold'>
                        {item.target}
                      </Typography>
                    </Typography>
                  </View>
                  {item.amount !== undefined && (
                    <Amount value={item.amount} variant='small' />
                  )}
                </View>
              ))}
            </Card>
          </Section>
        ))}
      </Column>
    </Screen>
  );
}
