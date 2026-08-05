import { useQuery } from "@tanstack/react-query";
import { fetchAirQuality } from "@/lib/openMeteoClient";

export function useAirQualityQuery(latitude: number, longitude: number) {
  return useQuery({
    queryKey: ["airQuality", latitude, longitude],
    queryFn: () => fetchAirQuality(latitude, longitude),
    staleTime: 10 * 60 * 1000,
  });
}
