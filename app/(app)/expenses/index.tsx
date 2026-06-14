import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { Receipt } from 'lucide-react-native';
import { useTheme } from '../../../src/theme/ThemeProvider';
import { Screen } from '../../../src/components/layout/Screen';
import { Header } from '../../../src/components/layout/Header';
import { Section } from '../../../src/components/layout/Section';
import { Row, Column } from '../../../src/components/layout/Row';
import { Typography, Card, Amount } from '../../../src/components/ui';
import {
  Spinner,
  EmptyState,
  ErrorState,
} from '../../../src/components/feedback';
import { ExpenseRow } from '../../../src/components/groups/ExpenseRow';
import { useAllExpenses, useOverview } from '../../../src/hooks';

export default function ExpensesScreen() {
  const theme = useTheme();
  const { expenses, isLoading, isError, refetch } = useAllExpenses();
  const { owedToYou, youOwe } = useOverview();

  return (
    <Screen variant='scroll' padding='none' onRefresh={refetch}>
      <View style={{ paddingHorizontal: theme.spacing.lg }}>
        <Header title='GroupCoin' titleTone='brand' leading='none' align='left' />
      </View>

      <Row gap='md' style={{ paddingHorizontal: theme.spacing.lg }}>
        <Card variant='default' padding='lg' style={{ flex: 1 }}>
          <Typography variant='caption' color='secondary'>
            You are owed
          </Typography>
          <Amount value={owedToYou} variant='large' type='positive' showSign={false} />
        </Card>
        <Card variant='default' padding='lg' style={{ flex: 1 }}>
          <Typography variant='caption' color='secondary'>
            You owe
          </Typography>
          <Amount value={youOwe} variant='large' type='negative' showSign={false} />
        </Card>
      </Row>

      <Section
        title='Recent expenses'
        style={{
          paddingHorizontal: theme.spacing.lg,
          paddingTop: theme.spacing.xl,
          paddingBottom: theme.spacing.lg,
        }}
      >
        {isLoading ? (
          <Spinner fill />
        ) : isError && expenses.length === 0 ? (
          <ErrorState error={new Error('Could not load expenses')} onRetry={refetch} />
        ) : expenses.length === 0 ? (
          <EmptyState
            title='No expenses yet'
            message='Expenses from all your groups will show up here.'
            icon={<Receipt size={48} color={theme.colors.text.muted} />}
          />
        ) : (
          <Column gap='md'>
            {expenses.map(expense => (
              <ExpenseRow
                key={expense.id}
                expense={expense}
                onPress={() => router.push(`/(app)/groups/${expense.groupId}`)}
              />
            ))}
          </Column>
        )}
      </Section>
    </Screen>
  );
}
