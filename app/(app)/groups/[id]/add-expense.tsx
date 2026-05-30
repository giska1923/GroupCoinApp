import React, { useMemo, useState } from 'react';
import { View, TextInput } from 'react-native';
import { router } from 'expo-router';
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

type SplitMode = 'equal' | 'exact' | 'percent';

const SPLIT_OPTIONS: SegmentOption<SplitMode>[] = [
  { value: 'equal', label: 'Split Equally' },
  { value: 'exact', label: 'By Exact' },
  { value: 'percent', label: 'By %' },
];

const FRIENDS = ['Alex', 'Maria', 'Bob', 'You'];

export default function AddExpenseScreen() {
  const theme = useTheme();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selected, setSelected] = useState<string[]>(['You', 'Alex']);
  const [splitMode, setSplitMode] = useState<SplitMode>('equal');

  const toggleFriend = (name: string) =>
    setSelected(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name],
    );

  const perPerson = useMemo(() => {
    const cents = Math.round((parseFloat(amount) || 0) * 100);
    if (!selected.length) return 0;
    return Math.floor(cents / selected.length);
  }, [amount, selected.length]);

  const close = () => {
    if (router.canGoBack()) router.back();
  };

  const canSave = (parseFloat(amount) || 0) > 0 && selected.length > 0;

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
            textColor={
              canSave ? theme.colors.brand[400] : theme.colors.text.muted
            }
            onPress={close}
          >
            Save
          </Button>
        }
      />

      {/* Amount display */}
      <Column align='center' gap='sm' style={{ paddingVertical: theme.spacing['2xl'] }}>
        <Row gap='xs' align='center'>
          <Typography variant='display' color='muted'>
            $
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

        {/* Friend chips */}
        <Column gap='md'>
          <Typography variant='caption' color='secondary' weight='medium'>
            Split between
          </Typography>
          <Row gap='sm' wrap>
            {FRIENDS.map(name => (
              <Chip
                key={name}
                label={name}
                selected={selected.includes(name)}
                onPress={() => toggleFriend(name)}
              />
            ))}
          </Row>
        </Column>

        {/* Split mode */}
        <SegmentedControl
          options={SPLIT_OPTIONS}
          value={splitMode}
          onChange={setSplitMode}
        />

        {splitMode === 'equal' && selected.length > 0 && (
          <View
            style={{
              alignItems: 'center',
              paddingVertical: theme.spacing.md,
            }}
          >
            <Typography variant='caption' color='secondary'>
              Each pays{' '}
              <Typography variant='caption' weight='semibold' color='accent'>
                ${(perPerson / 100).toFixed(2)}
              </Typography>
            </Typography>
          </View>
        )}
      </Column>
    </Screen>
  );
}
