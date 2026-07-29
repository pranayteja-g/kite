import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useProfile } from '../hooks/useProfile';

interface CurrencyContextValue {
  currency: string;
  formatCurrency: (amount: number, overrideCurrency?: string) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const { data: profile } = useProfile();
  const currency = profile?.default_currency ?? 'INR';

  const formatCurrency = (amount: number, overrideCurrency?: string) => {
    const cur = overrideCurrency ?? currency;
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: cur,
        maximumFractionDigits: 0,
      }).format(amount);
    } catch {
      return `${cur} ${amount.toFixed(0)}`;
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, formatCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}