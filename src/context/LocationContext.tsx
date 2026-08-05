import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Location } from "@/types/weather";

const DEFAULT_LOCATION: Location = {
  latitude: 37.5665,
  longitude: 126.978,
  name: "서울",
  isCurrentLocation: false,
};

interface LocationContextValue {
  location: Location;
  setLocation: (location: Location) => void;
}

const LocationContext = createContext<LocationContextValue | null>(null);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<Location>(DEFAULT_LOCATION);

  const value = useMemo(() => ({ location, setLocation }), [location]);

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocation must be used within a LocationProvider");
  return ctx;
}

export { DEFAULT_LOCATION };
