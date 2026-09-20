/**
 * ADS INTELLIGENCE — Offer Strategist Specialist
 * Enforces strict distinction between Current, Market, and AI Suggested Prices.
 */

import { OfferPricing } from '../types/ads-intelligence';
import { CurrencyCode, SUPPORTED_CURRENCIES } from '../types/currency';

function validateCurrencyCode(value: string): CurrencyCode {
  const upper = value.toUpperCase() as CurrencyCode;
  if (!(upper in SUPPORTED_CURRENCIES)) {
    throw new Error(`[OfferStrategist Violation] Moeda não suportada: ${value}. Suportadas: BRL, USD, EUR, GBP`);
  }
  return upper;
}

export class OfferStrategistSpecialist {
  /**
   * Builds an OfferPricing object strictly adhering to the price integrity rule.
   * Regra Crítica: Nunca apresentar um preço sugerido como se fosse preço real.
   */
  public static createOfferPricing(params: {
    currentPrice: number;
    marketPrice: number;
    aiSuggestedPrice: number;
    currency: string;
    originAndJustification: string;
    averageTicket: number;
    targetMarginPercent: number;
    maxAllowableCac: number;
    breakEvenPoint: number;
  }): OfferPricing {
    if (!params.originAndJustification || params.originAndJustification.trim().length < 10) {
      throw new Error(
        '[OfferStrategist Violation] Toda sugestão de preço (AI_SUGGESTED_PRICE) deve conter origem e justificativa detalhadas.'
      );
    }

    if (params.currentPrice <= 0 || params.marketPrice <= 0 || params.aiSuggestedPrice <= 0) {
      throw new Error('[OfferStrategist Violation] Valores de preço devem ser estritamente positivos.');
    }

    const validatedCurrency = params.currency ? validateCurrencyCode(params.currency) : 'BRL';

    return {
      currentPrice: params.currentPrice,
      marketPrice: params.marketPrice,
      aiSuggestedPrice: params.aiSuggestedPrice,
      currency: validatedCurrency,
      originAndJustification: params.originAndJustification,
      averageTicket: params.averageTicket,
      targetMarginPercent: params.targetMarginPercent,
      maxAllowableCac: params.maxAllowableCac,
      breakEvenPoint: params.breakEvenPoint
    };
  }

  /**
   * Formats prices with clear labels for human presentation.
   */
  public static formatPriceComparison(pricing: OfferPricing): {
    currentLabel: string;
    marketLabel: string;
    aiSuggestedLabel: string;
    variancePercent: number;
  } {
    const variance = ((pricing.aiSuggestedPrice - pricing.currentPrice) / pricing.currentPrice) * 100;
    return {
      currentLabel: `CURRENT_PRICE: ${pricing.currency} ${pricing.currentPrice.toFixed(2)}`,
      marketLabel: `MARKET_PRICE: ${pricing.currency} ${pricing.marketPrice.toFixed(2)}`,
      aiSuggestedLabel: `AI_SUGGESTED_PRICE: ${pricing.currency} ${pricing.aiSuggestedPrice.toFixed(2)} (${pricing.originAndJustification})`,
      variancePercent: parseFloat(variance.toFixed(1))
    };
  }
}
