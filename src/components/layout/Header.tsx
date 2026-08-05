import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CitySearchDialog } from "@/components/weather/CitySearchDialog";
import { useLocation } from "@/context/LocationContext";
import { useUnit } from "@/context/UnitContext";
import type { TemperatureUnit } from "@/types/weather";

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { location } = useLocation();
  const { unit, setUnit } = useUnit();

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border/60 bg-background/80 px-4 py-3 backdrop-blur-md sm:px-6">
      <Button
        variant="ghost"
        className="flex h-auto items-center gap-2 px-2 py-1.5"
        onClick={() => setSearchOpen(true)}
      >
        <MapPin className="size-5 text-primary" />
        <span className="text-base font-semibold sm:text-lg">{location.name}</span>
        <Search className="ml-1 size-4 text-muted-foreground" />
      </Button>

      <ToggleGroup
        type="single"
        value={unit}
        onValueChange={(value) => {
          if (value) setUnit(value as TemperatureUnit);
        }}
        variant="outline"
        size="sm"
      >
        <ToggleGroupItem value="C" aria-label="섭씨">
          °C
        </ToggleGroupItem>
        <ToggleGroupItem value="F" aria-label="화씨">
          °F
        </ToggleGroupItem>
      </ToggleGroup>

      <CitySearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
