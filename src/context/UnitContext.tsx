import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { TemperatureUnit } from "@/types/weather";

const STORAGE_KEY = "weatherapp:temperature-unit";

function readStoredUnit(): TemperatureUnit {
  if (typeof window === "undefined") return "C";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "F" ? "F" : "C";
}

interface UnitContextValue {
  unit: TemperatureUnit;
  setUnit: (unit: TemperatureUnit) => void;
}

const UnitContext = createContext<UnitContextValue | null>(null);

export function UnitProvider({ children }: { children: ReactNode }) {
  const [unit, setUnitState] = useState<TemperatureUnit>(readStoredUnit);

  const setUnit = (next: TemperatureUnit) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    setUnitState(next);
  };

  const value = useMemo(() => ({ unit, setUnit }), [unit]);

  return <UnitContext.Provider value={value}>{children}</UnitContext.Provider>;
}

export function useUnit() {
  const ctx = useContext(UnitContext);
  if (!ctx) throw new Error("useUnit must be used within a UnitProvider");
  return ctx;
}
