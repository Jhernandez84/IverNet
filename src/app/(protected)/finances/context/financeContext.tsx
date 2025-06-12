"use client";

// FiltersContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import {
  format,
  startOfMonth,
  startOfWeek,
  startOfYear,
  endOfMonth,
  endOfWeek,
} from "date-fns";

// types.ts
export type Filters = {
  filterPeriod: string | null;
  filterStartDate: string | null;
  filterEndDate: string | null;
  filterMovement: string | null;
  filterClass: string | null;
  filterMovStatus: string | null;
  filterPaymentMethod: string | null;
  filterBranch: string | null;
};

const STORAGE_KEY = "finance_filters";

type FiltersContextType = {
  filters: Filters;
  setFilters: (updater: (prev: Filters) => Filters) => void;
};

const defaultFilters: Filters = {
  filterPeriod: null,
  filterStartDate: null,
  filterEndDate: null,
  filterMovement: null,
  filterClass: null,
  filterMovStatus: null,
  filterPaymentMethod: null,
  filterBranch: null,
};

const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

export function FiltersFinanceProvider({ children }: { children: ReactNode }) {
  const [filters, setFiltersState] = useState<Filters>(defaultFilters);

  // 1. Al montar, hidratar desde localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setFiltersState(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // 2. Cada vez que cambian, persistir en localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  }, [filters]);

  const setFilters = (updater: (prev: Filters) => Filters) => {
    setFiltersState((prev) => updater(prev));
  };

  return (
    <FiltersContext.Provider value={{ filters, setFilters }}>
      {children}
    </FiltersContext.Provider>
  );
}

// Hook para consumir más cómodo
export function useFilters() {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error("useFilters debe usarse dentro de FiltersProvider");
  return ctx;
}
