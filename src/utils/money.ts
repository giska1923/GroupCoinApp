/**
 * Decimal-string money helpers. Avoid floating-point math until display formatting.
 * Amounts use fixed 2-decimal strings (e.g. "45.00", "-12.50").
 */

import {
  CURRENCY_SYMBOLS,
  DEFAULT_CURRENCY,
  SUPPORTED_CURRENCIES,
  filterSupportedBalances,
  resolveCurrency,
  type SupportedCurrency,
} from '../config/currency';

const ZERO = '0.00';

export { ZERO };

/** Normalize API amount (string decimal or legacy cents number) to decimal string. */
export const normalizeAmount = (value: string | number | undefined): string => {
  if (value === undefined || value === null) return ZERO;
  if (typeof value === 'string') return value;
  const negative = value < 0;
  const abs = Math.abs(value);
  const whole = Math.trunc(abs / 100);
  const frac = (abs % 100).toString().padStart(2, '0');
  return `${negative ? '-' : ''}${whole}.${frac}`;
};

/** Parse a decimal string into integer cents (bigint). */
export const moneyToCents = (amount: string): bigint => {
  const trimmed = amount.trim();
  if (!trimmed || trimmed === '0' || trimmed === '0.0' || trimmed === '0.00') {
    return 0n;
  }

  const negative = trimmed.startsWith('-');
  const abs = trimmed.replace(/^-/, '');
  const [wholePart = '0', fracPart = ''] = abs.split('.');
  const whole = BigInt(wholePart.replace(/^0+(?=\d)/, '') || '0');
  const frac = (fracPart + '00').slice(0, 2);
  const cents = whole * 100n + BigInt(frac);
  return negative ? -cents : cents;
};

/** Format integer cents as a signed decimal string. */
export const centsToMoney = (cents: bigint): string => {
  if (cents === 0n) return ZERO;
  const negative = cents < 0n;
  const abs = negative ? -cents : cents;
  const whole = abs / 100n;
  const frac = (abs % 100n).toString().padStart(2, '0');
  return `${negative ? '-' : ''}${whole}.${frac}`;
};

export const isZeroAmount = (amount: string | undefined | null): boolean =>
  moneyToCents(amount ?? ZERO) === 0n;

export const isPositiveAmount = (amount: string): boolean =>
  moneyToCents(amount) > 0n;

export const isNegativeAmount = (amount: string): boolean =>
  moneyToCents(amount) < 0n;

export const absAmount = (amount: string): string => {
  const cents = moneyToCents(amount);
  return centsToMoney(cents < 0n ? -cents : cents);
};

export const negateAmount = (amount: string): string =>
  centsToMoney(-moneyToCents(amount));

export const addAmounts = (...amounts: string[]): string => {
  const total = amounts.reduce(
    (sum, amount) => sum + moneyToCents(amount),
    0n,
  );
  return centsToMoney(total);
};

/** Split `total` equally across `n` participants; remainder goes to first shares. */
export const splitEqually = (total: string, n: number): string[] => {
  if (n <= 0) return [];
  const totalCents = moneyToCents(total);
  const base = totalCents / BigInt(n);
  const remainder = Number(totalCents % BigInt(n));
  return Array.from({ length: n }, (_, i) =>
    centsToMoney(base + BigInt(i < remainder ? 1 : 0)),
  );
};

/** Current user's balance entry for a group, or settled zero amounts. */
export const myBalanceAmounts = (
  balances: { userId: string; balances: { currency: string; amount: string }[] }[],
  userId: string | undefined,
  fallbackCurrency: string = DEFAULT_CURRENCY,
): { currency: string; amount: string }[] => {
  const currency = resolveCurrency(fallbackCurrency);
  if (!userId) return [{ currency, amount: ZERO }];
  const mine = balances.find(b => String(b.userId) === String(userId));
  if (!mine?.balances?.length) {
    return [{ currency, amount: ZERO }];
  }
  return filterSupportedBalances(mine.balances, currency);
};

export const formatMoneyLabel = (
  amount: string,
  currency: string = DEFAULT_CURRENCY,
  options?: { showSign?: boolean; showCurrencyCode?: boolean },
): string => {
  const resolved = resolveCurrency(currency);
  const { showSign = false, showCurrencyCode = false } = options ?? {};
  const cents = moneyToCents(amount);
  const isZero = cents === 0n;
  const isPositive = cents > 0n;
  const abs = centsToMoney(cents < 0n ? -cents : cents);
  const [whole, frac] = abs.split('.');
  const formatted = `${Number(whole).toLocaleString('en-US')}.${frac}`;
  const symbol = currencySymbol(resolved);

  let result = '';
  if (showSign && !isZero) result += isPositive ? '+' : '-';
  result += symbol + formatted;
  if (showCurrencyCode && SUPPORTED_CURRENCIES.length > 1) {
    result += ` ${resolved}`;
  }
  return result;
};

export const currencySymbol = (code: string): string => {
  const resolved = resolveCurrency(code);
  return CURRENCY_SYMBOLS[resolved as SupportedCurrency] ?? '$';
};
