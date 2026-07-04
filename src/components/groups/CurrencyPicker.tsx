import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { Check, ChevronDown } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Typography, TextField, Sheet } from '../ui';
import {
  CURRENCIES,
  findCurrency,
  type CurrencyInfo,
} from '../../config/currency';

interface CurrencyPickerProps {
  /** ISO 4217 code of the selected currency. */
  value: string;
  onChange: (code: string) => void;
  label?: string;
  /** Shown under the field, e.g. why the picker is locked. */
  hint?: string;
  disabled?: boolean;
}

const matchesQuery = (currency: CurrencyInfo, query: string): boolean => {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    currency.code.toLowerCase().includes(q) ||
    currency.name.toLowerCase().includes(q) ||
    currency.countries.some(country => country.toLowerCase().includes(q))
  );
};

export const CurrencyPicker: React.FC<CurrencyPickerProps> = ({
  value,
  onChange,
  label = 'Currency',
  hint,
  disabled = false,
}) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const selected = findCurrency(value);
  const filtered = useMemo(
    () => CURRENCIES.filter(c => matchesQuery(c, query)),
    [query],
  );

  const closeSheet = () => {
    setOpen(false);
    setQuery('');
  };

  const select = (code: string) => {
    onChange(code);
    closeSheet();
  };

  return (
    <View style={{ gap: theme.spacing.sm }}>
      {label && (
        <Typography variant='caption' color='secondary' weight='medium'>
          {label}
        </Typography>
      )}

      <Pressable
        disabled={disabled}
        onPress={() => setOpen(true)}
        accessibilityRole='button'
        accessibilityLabel={`Currency: ${value}`}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: theme.components.input.height,
          paddingHorizontal: theme.spacing.lg,
          gap: theme.spacing.md,
          backgroundColor: theme.colors.surface.secondary,
          borderRadius: theme.components.input.radius,
          borderWidth: 1,
          borderColor: theme.colors.surface.border,
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <Typography variant='body' weight='semibold'>
          {selected?.symbol ?? value}
        </Typography>
        <Typography variant='body' style={{ flex: 1 }} numberOfLines={1}>
          {value}
          {selected ? ` — ${selected.name}` : ''}
        </Typography>
        {!disabled && (
          <ChevronDown size={18} color={theme.colors.text.secondary} />
        )}
      </Pressable>

      {hint && (
        <Typography
          variant='label'
          color='muted'
          style={{ paddingHorizontal: theme.spacing.xs }}
        >
          {hint}
        </Typography>
      )}

      <Sheet visible={open} onClose={closeSheet} title='Select currency' showClose>
        <View style={{ gap: theme.spacing.md, height: 440 }}>
          <TextField
            placeholder='Search by code, name, or country'
            value={query}
            onChangeText={setQuery}
            autoCapitalize='none'
            autoCorrect={false}
          />
          <FlatList
            data={filtered}
            keyExtractor={item => item.code}
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Typography
                variant='body'
                color='muted'
                align='center'
                style={{ paddingVertical: theme.spacing.xl }}
              >
                No currencies match your search.
              </Typography>
            }
            renderItem={({ item }) => {
              const isSelected = item.code === value;
              return (
                <Pressable
                  onPress={() => select(item.code)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: theme.spacing.md,
                    paddingVertical: theme.spacing.md,
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.surface.border,
                  }}
                >
                  <View
                    style={{
                      width: 44,
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant='body' weight='semibold'>
                      {item.symbol}
                    </Typography>
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Typography variant='body' weight='medium'>
                      {item.code} — {item.name}
                    </Typography>
                    <Typography variant='caption' color='muted' numberOfLines={1}>
                      {item.countries.join(', ')}
                    </Typography>
                  </View>
                  {isSelected && (
                    <Check size={18} color={theme.colors.brand[400]} />
                  )}
                </Pressable>
              );
            }}
          />
        </View>
      </Sheet>
    </View>
  );
};
