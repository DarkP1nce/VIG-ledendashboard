"use client";

import { createContext, useContext, useState } from "react";
import type { DisplayCurrency } from "@/lib/fx";

interface CurrencyContextValue {
  displayCurrency: DisplayCurrency;
  setDisplayCurrency: (c: DisplayCurrency) => void;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  displayCurrency: "original",
  setDisplayCurrency: () => {},
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [displayCurrency, setDisplayCurrency] = useState<DisplayCurrency>("original");
  return (
    <CurrencyContext.Provider value={{ displayCurrency, setDisplayCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useDisplayCurrency() {
  return useContext(CurrencyContext);
}
