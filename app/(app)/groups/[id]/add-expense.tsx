import React, { useEffect, useMemo, useState } from 'react';
import { View, TextInput } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../../../src/theme/ThemeProvider';
import { Screen } from '../../../../src/components/layout/Screen';
import { Header } from '../../../../src/components/layout/Header';
import { Row, Column } from '../../../../src/components/layout/Row';
import {
  Typography,
  Button,
  Chip,
  SegmentedControl,
  type SegmentOption,
} from '../../../../src/components/ui';
import { Spinner } from '../../../../src/components/feedback';
import {
  useGroup,
  useGroupMembers,
  useCreateExpense,
} from '../../../../src/hooks';
import { useAuthStore } from '../../../../src/stores/auth.store';
import { ClientError } from '../../../../src/api/errors';

type SplitMode = 'EQUAL';

const SPLIT_OPTIONS: SegmentOption<SplitMode>[] = [
  { value: 'EQUAL', label: 'Split Equally' },
];

export default function AddExpenseScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const groupId = String(id);
  const userId = useAuthStore(s => s.user?.id);

  const group = useGroup(groupId);
  const members = useGroupMembers(groupId);
  const createExpense = useCreateExpense(groupId);

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [splitMode, setSplitMode] = useState<SplitMode>('EQUAL');

  const currency = group.data?.currency ?? 'USD';

  // Default to splitting between everyone once members load.
  useEffect(() => {
    if (members.data && selected.length === 0) {
      setSelected(members.data.map(m => m.userId));
    }
  }, [members.data, selected.length]);

  const toggle = (uid: string) =>
    setSelected(prev =>
      prev.includes(uid) ? prev.filter(x => x !== uid) : [...prev, uid],
    );

  const perPerson = useMemo(() => {
    const cents = Math.round((parseFloat(amount) || 0) * 100);
    if (!selected.length) return 0;
    return Math.floor(cents / selected.length);
  }, [amount, selected.length]);

  const close = () => {
    if (router.canGoBack()) router.back();
  };

  const canSave =
    (parseFloat(amount) || 0) > 0 &&
    description.trim().length > 0 &&
    selected.length > 0 &&
    !createExpense.isPending;

  const handleSave = () => {
    const normalized = (parseFloat(amount) || 0).toFixed(2);
    createExpense.mutate(
      {
        description: description.trim(),
        amount: normalized,
        currency,
        paidBy: userId,
        splitType: 'EQUAL',
        participantIds: selected,
      },
      { onSuccess: close },
    );
  };

  const errorMessage =
    createExpense.error instanceof ClientError
      ? createExpense.error.message
      : createExpense.error
        ? 'Could not save the expense. Please try again.'
        : undefined;

  return (
    <Screen variant='scroll' padding='lg' edges={['top', 'left', 'right']}>
      <Header
        title='New Expense'
        leading='close'
        onLeadingPress={close}
        right={
          <Button
            variant='ghost'
            size='sm'
            disabled={!canSave}
            textColor={canSave ? theme.colors.brand[400] : theme.colors.text.muted}
            onPress={handleSave}
          >
            Save
          </Button>
        }
      />

      {/* Amount display */}
      <Column align='center' gap='sm' style={{ paddingVertical: theme.spacing['2xl'] }}>
        <Row gap='xs' align='center'>
          <Typography variant='display' color='muted'>
            {symbol(currency)}
          </Typography>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder='0.00'
            keyboardType='decimal-pad'
            placeholderTextColor={theme.colors.text.muted}
            selectionColor={theme.colors.brand[400]}
            style={{
              color: theme.colors.text.primary,
              fontSize: theme.fontSize['5xl'],
              fontWeight: theme.fontWeight.bold,
              minWidth: 140,
              textAlign: 'center',
              padding: 0,
            }}
          />
        </Row>
      </Column>

      <Column gap='xl'>
        {/* Description */}
        <Column gap='sm'>
          <Typography variant='caption' color='secondary' weight='medium'>
            What was this for?
          </Typography>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder='Dinner, taxi, groceries…'
            placeholderTextColor={theme.colors.text.muted}
            selectionColor={theme.colors.brand[400]}
            style={{
              color: theme.colors.text.primary,
              fontSize: theme.fontSize.lg,
              paddingVertical: theme.spacing.sm,
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.surface.border,
            }}
          />
        </Column>

        {/* Member chips */}
        <Column gap='md'>
          <Typography variant='caption' color='secondary' weight='medium'>
            Split between
          </Typography>
          {members.isLoading ? (
            <Spinner size='small' style={{ alignItems: 'flex-start' }} />
          ) : (
            <Row gap='sm' wrap>
              {(members.data ?? []).map(member => (
                <Chip
                  key={member.userId}
                  label={
                    member.userId === userId
                      ? 'You'
                      : member.user?.name ?? 'Member'
                  }
                  selected={selected.includes(member.userId)}
                  onPress={() => toggle(member.userId)}
                />
              ))}
            </Row>
          )}
        </Column>

        {/* Split mode */}
        <SegmentedControl
          options={SPLIT_OPTIONS}
          value={splitMode}
          onChange={setSplitMode}
        />

        {selected.length > 0 && (
          <View style={{ alignItems: 'center', paddingVertical: theme.spacing.md }}>
            <Typography variant='caption' color='secondary'>
              Each pays{' '}
              <Typography variant='caption' weight='semibold' color='accent'>
                {symbol(currency)}
                {(perPerson / 100).toFixed(2)}
              </Typography>
            </Typography>
          </View>
        )}

        {errorMessage && (
          <Typography variant='caption' color='negative' align='center'>
            {errorMessage}
          </Typography>
        )}

        <Button
          variant='primary'
          size='lg'
          fullWidth
          loading={createExpense.isPending}
          disabled={!canSave}
          onPress={handleSave}
        >
          Save Expense
        </Button>
      </Column>
    </Screen>
  );
}

const symbol = (code: string): string =>
  ({ USD: '$', EUR: '€', GBP: '£', JPY: '¥' })[code] ?? `${code} `;
