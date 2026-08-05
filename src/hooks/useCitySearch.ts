import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchCities } from "@/lib/openMeteoClient";

export function useCitySearch(query: string) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(id);
  }, [query]);

  return useQuery({
    queryKey: ["citySearch", debouncedQuery],
    queryFn: () => searchCities(debouncedQuery),
    enabled: debouncedQuery.trim().length > 0,
    staleTime: 5 * 60 * 1000,
  });
}
