import { AlertTriangle, Droplet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { WeatherIcon } from "@/components/weather/WeatherIcon";
import { HourlyTemperatureChart } from "@/components/weather/HourlyTemperatureChart";
import { formatHour, formatTemperature } from "@/lib/format";
import { useUnit } from "@/context/UnitContext";
import type { ForecastData } from "@/types/weather";

interface HourlyForecastCardProps {
  data: ForecastData | undefined;
  isLoading: boolean;
  isError: boolean;
}

export function HourlyForecastCard({ data, isLoading, isError }: HourlyForecastCardProps) {
  const { unit } = useUnit();

  return (
    <Card className="bg-card/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>시간별 예보</CardTitle>
      </CardHeader>
      <CardContent>
        {isError && (
          <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
            <AlertTriangle className="size-4" />
            시간별 예보를 불러오지 못했습니다.
          </div>
        )}

        {!isError && (
          <>
            {isLoading || !data ? (
              <Skeleton className="mb-4 h-32 w-full rounded-lg sm:h-36" />
            ) : (
              <div className="mb-4">
                <HourlyTemperatureChart hours={data.hourly} unit={unit} />
              </div>
            )}

            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-3 pb-2">
                {isLoading || !data
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <Skeleton key={i} className="h-32 w-16 shrink-0 rounded-lg" />
                    ))
                  : data.hourly.map((hour) => (
                      <div
                        key={hour.time}
                        className="flex w-16 shrink-0 flex-col items-center gap-2 rounded-lg bg-muted/50 px-2 py-3"
                      >
                        <span className="text-xs text-muted-foreground">
                          {formatHour(hour.time)}
                        </span>
                        <WeatherIcon
                          code={hour.weatherCode}
                          isDay={hour.isDay}
                          className="size-6 text-primary"
                        />
                        <span className="flex items-center gap-0.5 text-xs text-sky-500">
                          <Droplet className="size-3" />
                          {hour.precipitationProbability}%
                        </span>
                        <span className="text-sm font-medium">
                          {formatTemperature(hour.temperature, unit)}
                        </span>
                      </div>
                    ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </>
        )}
      </CardContent>
    </Card>
  );
}
