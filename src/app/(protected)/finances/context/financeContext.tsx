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
  startOfDay,
  startOfWeek,
  startOfMonth,
  startOfYear,
  format,
  subMonths,
  endOfMonth,
  endOfYear,
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

export function getDateRangeByPeriod(period: string): {
  filterStartDate: string;
  filterEndDate: string;
} {
  const today = new Date();

  let start = today;
  let end = today;
  switch (period) {
    case "dia":
      start = startOfDay(today);
      end = startOfDay(today);
      break;
    case "semana":
      start = startOfWeek(today, { weekStartsOn: 1 }); // lunes
      end = startOfDay(today);
      break;
    case "mes":
      start = startOfMonth(today);
      end = today;
      break;
    case "ultmes":
      start = startOfMonth(subMonths(new Date(), 1));
      end = endOfMonth(subMonths(new Date(), 1));
      break;
    case "anio":
      start = startOfYear(today);
      end = today;
      break;
    case "custom":
      start = startOfDay(today);
      end = startOfDay(today);
      break;
    default:
      return {
        filterStartDate: "",
        filterEndDate: "",
      };
  }

  return {
    filterStartDate: format(start, "yyyy-MM-dd"),
    filterEndDate: format(end, "yyyy-MM-dd"),
  };
}

const { filterStartDate, filterEndDate } = getDateRangeByPeriod("mes");

const defaultFilters: Filters = {
  filterPeriod: "mes",
  filterStartDate,
  filterEndDate,
  filterMovement: null,
  filterClass: null,
  filterMovStatus: null,
  filterPaymentMethod: null,
  filterBranch: null,
};

type FiltersContextType = {
  filters: Filters;
  setFilters: (updater: (prev: Filters) => Filters) => void;
};

const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

export function FiltersFinanceProvider({ children }: { children: ReactNode }) {
  const [filters, setFiltersState] = useState<Filters>(defaultFilters);

  useEffect(() => {
    if (
      filters.filterPeriod &&
      ["dia", "semana", "mes", "ultmes", "anio", "custom"].includes(
        filters.filterPeriod
      )
    ) {
      const { filterStartDate, filterEndDate } = getDateRangeByPeriod(
        filters.filterPeriod
      );
      setFiltersState((prev) => ({
        ...prev,
        filterStartDate,
        filterEndDate,
      }));
    }
  }, [filters.filterPeriod]);
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
