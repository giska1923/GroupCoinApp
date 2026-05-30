import React from 'react';
import { View } from 'react-native';
import { Pizza, Zap, Car, Search } from 'lucide-react-native';
import { useTheme } from '../../../src/theme/ThemeProvider';
import { Screen } from '../../../src/components/layout/Screen';
import { Header } from '../../../src/components/layout/Header';
import { Section } from '../../../src/components/layout/Section';
import { Row } from '../../../src/components/layout/Row';
import { Typography, Card, Amount, ListItem } from '../../../src/components/ui';

type ExpenseItem = {
  id: string;
  description: string;
  group: string;
  amount: number; // cents, signed for "your" involvement
  icon: React.ReactNode;
};

export default function ExpensesScreen() {
  const theme = useTheme();

  const owed = 142000;
  const owe = 19000;

  const expenses: ExpenseItem[] = [
    {
      id: '1',
      description: 'Dinner at Nobu',
      group: 'Tokyo Trip',
      amount: 5000,
      icon: <Pizza size={18} color={theme.colors.brand[400]} />,
    },
    {
      id: '2',
      description: 'Electricity',
      group: 'Roommates',
      amount: -4000,
      icon: <Zap size={18} color={theme.colors.brand[400]} />,
    },
    {
      id: '3',
      description: 'Taxi',
      group: 'Tokyo Trip',
      amount: -2500,
      icon: <Car size={18} color={theme.colors.brand[400]} />,
    },
  ];

  return (
    <Screen variant='scroll' padding='none'>
      <View style={{ paddingHorizontal: theme.spacing.lg }}>
        <Header
          title='Expenses'
          leading='none'
          align='left'
          right={<Search size={22} color={theme.colors.text.secondary} />}
        />
      </View>

      {/* Quick stats */}
      <Row gap='md' style={{ paddingHorizontal: theme.spacing.lg }}>
        <Card variant='default' padding='lg' style={{ flex: 1 }}>
          <Typography variant='caption' color='secondary'>
            You are owed
          </Typography>
          <Amount value={owed} variant='large' type='positive' showSign={false} />
        </Card>
        <Card variant='default' padding='lg' style={{ flex: 1 }}>
          <Typography variant='caption' color='secondary'>
            You owe
          </Typography>
          <Amount value={-owe} variant='large' type='negative' showSign={false} />
        </Card>
      </Row>

      <Section
        title='Recent expenses'
        style={{
          paddingHorizontal: theme.spacing.lg,
          paddingTop: theme.spacing.xl,
          paddingBottom: theme.spacing['6xl'],
        }}
      >
        <Card variant='default' padding='none'>
          {expenses.map((item, index) => (
            <ListItem
              key={item.id}
              title={item.description}
              subtitle={item.group}
              leading={item.icon}
              trailing={<Amount value={item.amount} variant='default' />}
              divider={index < expenses.length - 1}
              onPress={() => {}}
            />
          ))}
        </Card>
      </Section>
    </Screen>
  );
}
