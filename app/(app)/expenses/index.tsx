import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { Receipt } from 'lucide-react-native';
import { useTheme } from '../../../src/theme/ThemeProvider';
import { Screen } from '../../../src/components/layout/Screen';
import { Header } from '../../../src/components/layout/Header';
import { Section } from '../../../src/components/layout/Section';
import { Row } from '../../../src/components/layout/Row';
import { Typography, Card, Amount, ListItem } from '../../../src/components/ui';
import {
  Spinner,
  EmptyState,
  ErrorState,
} from '../../../src/components/feedback';
import { useAllExpenses, useOverview } from '../../../src/hooks';
import { useAuthStore } from '../../../src/stores/auth.store';
import { expenseUserNet } from '../../../src/utils/expense';

export default function ExpensesScreen() {
  const theme = useTheme();
  const userId = useAuthStore(s => s.user?.id);
  const { expenses, isLoading, isError, refetch } = useAllExpenses();
  const { owedToYou, youOwe } = useOverview();

  return (
    <Screen variant='scroll' padding='none' onRefresh={refetch}>
      <View style={{ paddingHorizontal: theme.spacing.lg }}>
        <Header title='Expenses' leading='none' align='left' />
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
          <Amount value={-youOwe} variant='large' type='negative' showSign={false} />
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
          <Card variant='default' padding='none'>
            {expenses.map((expense, index) => {
              const net = expenseUserNet(expense, userId);
              return (
                <ListItem
                  key={expense.id}
                  title={expense.description}
                  subtitle={expense.groupName ?? expense.currency}
                  leading={<Receipt size={18} color={theme.colors.brand[400]} />}
                  trailing={
                    net === 0 ? (
                      <Typography variant='caption' color='muted'>
                        —
                      </Typography>
                    ) : (
                      <Amount value={net} currency={expense.currency} variant='default' />
                    )
                  }
                  divider={index < expenses.length - 1}
                  onPress={() =>
                    router.push(`/(app)/groups/${expense.groupId}`)
                  }
                />
              );
            })}
          </Card>
        )}
      </Section>
    </Screen>
  );
}
