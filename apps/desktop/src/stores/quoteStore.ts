import { create } from "zustand";
import type { QuoteResult } from "../utils/quoteEngine";

interface QuoteState {
  showQuotePanel: boolean;
  quote: QuoteResult | null;
  rates: {
    paintPercent: number;
    assemblyPerItem: number;
    assemblyPerKg: number;
    transportBase: number;
    transportPerKg: number;
    marginPercent: number;
  };
  setShowQuotePanel: (show: boolean) => void;
  setQuote: (quote: QuoteResult | null) => void;
  updateRates: (rates: Partial<QuoteState["rates"]>) => void;
}

export const useQuoteStore = create<QuoteState>((set) => ({
  showQuotePanel: false,
  quote: null,
  rates: {
    paintPercent: 0.18,
    assemblyPerItem: 35,
    assemblyPerKg: 0.8,
    transportBase: 45,
    transportPerKg: 0.15,
    marginPercent: 0.35,
  },
  setShowQuotePanel: (show) => set({ showQuotePanel: show }),
  setQuote: (quote) => set({ quote }),
  updateRates: (rates) => set((s) => ({ rates: { ...s.rates, ...rates } })),
}));
