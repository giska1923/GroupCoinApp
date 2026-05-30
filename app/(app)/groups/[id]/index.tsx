import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Settings, Plus, Utensils, Car } from 'lucide-react-native';
import { useTheme } from '../../../../src/theme/ThemeProvider';
import { Screen } from '../../../../src/components/layout/Screen';
import { Header } from '../../../../src/components/layout/Header';
import { Row, Column } from '../../../../src/components/layout/Row';
import { Typography, Card, Button, Amount } from '../../../../src/components/ui';

type LedgerEntry = {
  id: string;
  title: string;
  addedBy: string;
  amount: number; // signed cents from "your" perspective
  icon: React.ReactNode;
};

export default function GroupDetailScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  const entries: LedgerEntry[] = [
    {
      id: '1',
      title: 'Dinner at Nobu',
      addedBy: 'Alex',
      amount: 5000,
      icon: <Utensils size={20} color={theme.colors.brand[400]} />,
    },
    {
      id: '2',
      title: 'Taxi',
      addedBy: 'Alex',
      amount: -2500,
      icon: <Car size={20} color={theme.colors.brand[400]} />,
    },
  ];

  return (
    <Screen variant='scroll' padding='none'>
      <View style={{ paddingHorizontal: theme.spacing.lg }}>
        <Header
          title='Tokyo Trip Ledger'
          right={<Settings size={22} color={theme.colors.text.secondary} />}
        />
      </View>

      <Column
        gap='lg'
        style={{
          paddingHorizontal: theme.spacing.lg,
          paddingBottom: theme.spacing['6xl'],
        }}
      >
        <View style={{ alignItems: 'center' }}>
          <Button variant='primary' size='md' rounded onPress={() => {}}>
            Settle Up
          </Button>
        </View>

        {entries.map(entry => {
          const positive = entry.amount > 0;
          return (
            <Card
              key={entry.id}
              variant='default'
              padding='none'
              style={{ overflow: 'hidden' }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
                <Column gap='sm' style={{ flex: 1, padding: theme.spacing.lg }}>
                  <Row gap='sm'>
                    {entry.icon}
                    <Typography variant='body' weight='semibold'>
                      {entry.title}
                    </Typography>
                  </Row>
                  <Typography variant='caption' color='secondary'>
                    Added by {entry.addedBy}
                  </Typography>
                </Column>

                <Column
                  justify='center'
                  align='center'
                  gap='xs'
                  style={{
                    width: 132,
                    paddingHorizontal: theme.spacing.md,
                    backgroundColor: positive
                      ? theme.colors.success.bg
                      : theme.colors.error.bg,
                  }}
                >
                  <Typography
                    variant='label'
                    weight='semibold'
                    style={{
                      color: positive
                        ? theme.colors.financialPositive
                        : theme.colors.financialNegative,
                    }}
                  >
                    {positive ? 'Owes You' : 'You Owe'}
                  </Typography>
                  <Amount
                    value={entry.amount}
                    variant='large'
                    type={positive ? 'positive' : 'negative'}
                  />
                </Column>
              </View>
            </Card>
          );
        })}
      </Column>

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
          onPress={() => router.push(`/(app)/groups/${id}/add-expense`)}
        />
      </View>
    </Screen>
  );
}
