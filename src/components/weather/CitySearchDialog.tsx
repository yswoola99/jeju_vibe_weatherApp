import { useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useCitySearch } from "@/hooks/useCitySearch";
import { useLocation } from "@/context/LocationContext";
import { formatLocationLabel } from "@/lib/format";
import type { GeocodingResult } from "@/types/weather";

interface CitySearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CitySearchDialog({ open, onOpenChange }: CitySearchDialogProps) {
  const [query, setQuery] = useState("");
  const { data: results, isFetching } = useCitySearch(query);
  const { setLocation } = useLocation();

  const handleSelect = (result: GeocodingResult) => {
    setLocation({
      latitude: result.latitude,
      longitude: result.longitude,
      name: formatLocationLabel(result.name, result.admin1),
      isCurrentLocation: false,
    });
    onOpenChange(false);
    setQuery("");
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="도시 검색"
      description="변경할 도시를 검색하세요"
    >
      <CommandInput
        placeholder="도시 이름을 입력하세요 (예: 제주, 서울, 도쿄)"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {isFetching && (
          <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            검색 중...
          </div>
        )}
        {!isFetching && query.trim().length > 0 && (
          <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
        )}
        {!isFetching && results && results.length > 0 && (
          <CommandGroup heading="검색 결과">
            {results.map((result) => (
              <CommandItem
                key={result.id}
                value={`${result.name}-${result.id}`}
                onSelect={() => handleSelect(result)}
              >
                <MapPin className="size-4 text-muted-foreground" />
                <span>{result.name}</span>
                <span className="text-xs text-muted-foreground">
                  {[result.admin1, result.country].filter(Boolean).join(", ")}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
