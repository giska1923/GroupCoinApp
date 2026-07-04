import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../../src/theme/ThemeProvider';
import { Header } from '../../../../src/components/layout/Header';
import { Row, Column } from '../../../../src/components/layout/Row';
import { Typography, Button, Chip } from '../../../../src/components/ui';
import { Spinner } from '../../../../src/components/feedback';
import {
  useGroup,
  useGroupMembers,
  useCreateExpense,
} from '../../../../src/hooks';
import { useAuthStore } from '../../../../src/stores/auth.store';
import { ClientError } from '../../../../src/api/errors';
import { DEFAULT_CURRENCY } from '../../../../src/config/currency';
import {
  splitEqually,
  formatMoneyLabel,
  currencySymbol,
} from '../../../../src/utils/money';

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

  // Expenses always use the group's currency.
  const currency = group.data?.currency ?? DEFAULT_CURRENCY;

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
    const normalized = (parseFloat(amount) || 0).toFixed(2);
    if (!selected.length) return '0.00';
    return splitEqually(normalized, selected.length)[0] ?? '0.00';
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

  const allMemberIds = useMemo(
    () => (members.data ?? []).map(m => m.userId),
    [members.data],
  );

  const allSelected =
    allMemberIds.length > 0 &&
    allMemberIds.every(memberId => selected.includes(memberId));

  const selectAllMembers = () => setSelected(allMemberIds);

  const memberLabel = (memberUserId: string, name?: string | null) => {
    if (memberUserId === userId) return 'You';
    const display = (name ?? 'Member').trim();
    return display.length <= 12 ? display.toUpperCase() : display;
  };

  const fieldTextStyle = {
    color: theme.colors.text.primary,
    fontSize: theme.fontSize['3xl'] + 2,
    fontWeight: theme.fontWeight.bold,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface.border,
  } as const;

  return (
    <View style={styles.root}>
      <Pressable
        style={[StyleSheet.absoluteFill, styles.backdrop]}
        onPress={close}
        accessibilityRole='button'
        accessibilityLabel='Close'
      />
      <View
        style={[StyleSheet.absoluteFill, styles.frost]}
        pointerEvents='none'
      />

      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
        >
          <ScrollView
            style={styles.flex}
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: theme.spacing.lg,
              paddingBottom: theme.spacing['3xl'],
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps='handled'
          >
            <Header
              title='New Expense'
              leading='close'
              onLeadingPress={close}
              style={{ backgroundColor: 'transparent' }}
              right={
                <Button
                  variant='ghost'
                  size='sm'
                  disabled={!canSave}
                  textColor={
                    canSave ? theme.colors.brand[400] : theme.colors.text.muted
                  }
                  onPress={handleSave}
                >
                  Save
                </Button>
              }
            />

            {/* Amount display */}
            <Column
              align='center'
              gap='sm'
              style={{ paddingVertical: theme.spacing['3xl'] }}
            >
              <Row gap='xs' align='center'>
                <Typography
                  variant='display'
                  color='muted'
                  style={{
                    fontSize: theme.fontSize['5xl'],
                  }}
                >
                  {currencySymbol(currency)}
                </Typography>
                <TextInput
                  value={amount}
                  onChangeText={setAmount}
                  placeholder='0.00'
                  keyboardType='decimal-pad'
                  placeholderTextColor={theme.colors.text.primary}
                  selectionColor={theme.colors.brand[400]}
                  style={{
                    color: theme.colors.text.primary,
                    fontSize: 60,
                    fontWeight: theme.fontWeight.bold,
                    minWidth: 200,
                    textAlign: 'center',
                    padding: 0,
                  }}
                />
              </Row>
            </Column>

            <Column gap='xl'>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder='What was this for?'
                placeholderTextColor={theme.colors.text.secondary}
                selectionColor={theme.colors.brand[400]}
                style={fieldTextStyle}
              />

              {members.isLoading ? (
                <Spinner size='small' style={{ alignItems: 'flex-start' }} />
              ) : (
                <Row gap='sm'>
                  {(members.data ?? []).map(member => (
                    <Chip
                      key={member.userId}
                      label={memberLabel(member.userId, member.user?.name)}
                      selected={selected.includes(member.userId)}
                      onPress={() => toggle(member.userId)}
                      variant='split'
                      equalWidth
                      labelStyle={{
                        fontSize: theme.fontSize.md,
                        fontWeight: theme.fontWeight.bold,
                      }}
                    />
                  ))}
                  <Chip
                    label='Split equally'
                    selected={allSelected}
                    onPress={selectAllMembers}
                    variant='split'
                    equalWidth
                    showCheckWhenSelected={false}
                    labelStyle={{
                      fontSize: theme.fontSize.md,
                      fontWeight: theme.fontWeight.bold,
                    }}
                  />
                </Row>
              )}

              {selected.length > 0 && (
                <View
                  style={{
                    alignItems: 'center',
                    paddingVertical: theme.spacing.md,
                  }}
                >
                  <Typography
                    variant='heading'
                    color='primary'
                    weight='bold'
                    align='center'
                    style={{ fontSize: theme.fontSize['3xl'] }}
                  >
                    Each pays{' '}
                    <Typography
                      variant='heading'
                      color='accent'
                      weight='bold'
                      style={{ fontSize: theme.fontSize['3xl'] }}
                    >
                      {formatMoneyLabel(perPerson, currency)}
                    </Typography>
                  </Typography>
                </View>
              )}

              {errorMessage && (
                <Typography
                  variant='body'
                  weight='medium'
                  color='negative'
                  align='center'
                >
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
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  // Lighter, slightly blue-toned slate scrim — a clean dark surface that
  // matches the goal without crushing to near-black.
  frost: {
    backgroundColor: 'rgba(38, 41, 56, 0.92)',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  flex: {
    flex: 1,
  },
});
