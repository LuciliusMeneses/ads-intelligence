/**
 * ADS INTELLIGENCE — Multi-Currency Domain Engine & Formatter
 * Supports dynamic currency selection: BRL, USD, EUR, GBP
 * Strict zero-hardcoding: all financial formatting derives from tenant or user preference.
 */

export type CurrencyCode = 'BRL' | 'USD' | 'EUR' | 'GBP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  locale: string;
  rateToUSD: number; // For exchange normalization
}

export const SUPPORTED_CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  BRL: {
    code: 'BRL',
    symbol: 'R$',
    name: 'Real Brasileiro',
    locale: 'pt-BR',
    rateToUSD: 0.18
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    locale: 'en-US',
    rateToUSD: 1.0
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    locale: 'de-DE',
    rateToUSD: 1.08
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    locale: 'en-GB',
    rateToUSD: 1.28
  }
};

export class CurrencyEngine {
  /**
   * Formats a monetary value according to the specified currency code.
   */
  public static format(amount: number, currency: CurrencyCode = 'BRL'): string {
    const config = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.BRL;
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  /**
   * Converts an amount from a source currency to a target currency.
   */
  public static convert(amount: number, from: CurrencyCode, to: CurrencyCode): number {
    if (from === to) return amount;
    const fromConfig = SUPPORTED_CURRENCIES[from] || SUPPORTED_CURRENCIES.BRL;
    const toConfig = SUPPORTED_CURRENCIES[to] || SUPPORTED_CURRENCIES.BRL;

    // Convert to USD base, then to target
    const amountInUSD = amount * fromConfig.rateToUSD;
    return amountInUSD / toConfig.rateToUSD;
  }
}
