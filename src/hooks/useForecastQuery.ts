import { useQuery } from "@tanstack/react-query";
import { fetchForecast } from "@/lib/openMeteoClient";

export function useForecastQuery(latitude: number, longitude: number) {
  return useQuery({
    queryKey: ["forecast", latitude, longitude],
    queryFn: () => fetchForecast(latitude, longitude),
    staleTime: 10 * 60 * 1000,
  });
}
