/**
 * Currency configuration. The backend currently supports USD only; keep this
 * module as the single place to expand when more currencies ship.
 */

export const SUPPORTED_CURRENCIES = ['USD'] as const;

export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

export const DEFAULT_CURRENCY: SupportedCurrency = 'USD';

/** ISO code → display symbol. Add entries as SUPPORTED_CURRENCIES grows. */
export const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
  USD: '$',
};

export const isSupportedCurrency = (code: string): code is SupportedCurrency =>
  (SUPPORTED_CURRENCIES as readonly string[]).includes(code);

/** Resolve a currency code to a supported one (defaults to USD). */
export const resolveCurrency = (code: string | undefined): SupportedCurrency =>
  code && isSupportedCurrency(code) ? code : DEFAULT_CURRENCY;

/** Filter balance rows to supported currencies; structure stays multi-currency-ready. */
export const filterSupportedBalances = <
  T extends { currency: string; amount: string },
>(
  balances: T[],
  fallbackCurrency: SupportedCurrency = DEFAULT_CURRENCY,
): T[] => {
  const supported = balances.filter(b => isSupportedCurrency(b.currency));
  if (supported.length > 0) return supported;
  return [{ currency: fallbackCurrency, amount: '0.00' } as T];
};
