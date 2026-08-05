import { AlertTriangle, Droplet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { WeatherIcon } from "@/components/weather/WeatherIcon";
import { formatTemperature, formatWeekday } from "@/lib/format";
import { useUnit } from "@/context/UnitContext";
import type { ForecastData } from "@/types/weather";

interface DailyForecastCardProps {
  data: ForecastData | undefined;
  isLoading: boolean;
  isError: boolean;
}

export function DailyForecastCard({ data, isLoading, isError }: DailyForecastCardProps) {
  const { unit } = useUnit();

  return (
    <Card className="bg-card/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>7일 예보</CardTitle>
      </CardHeader>
      <CardContent>
        {isError && (
          <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
            <AlertTriangle className="size-4" />
            7일 예보를 불러오지 못했습니다.
          </div>
        )}

        {!isError && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
            {isLoading || !data
              ? Array.from({ length: 7 }).map((_, i) => (
                  <Skeleton key={i} className="h-36 rounded-lg" />
                ))
              : data.daily.map((day) => (
                  <div
                    key={day.date}
                    className="flex flex-col items-center gap-2 rounded-lg bg-muted/50 px-2 py-3"
                  >
                    <span className="text-sm font-medium">{formatWeekday(day.date)}</span>
                    <WeatherIcon
                      code={day.weatherCode}
                      isDay={true}
                      className="size-7 text-primary"
                    />
                    <span className="flex items-center gap-0.5 text-xs text-sky-500">
                      <Droplet className="size-3" />
                      {day.precipitationProbability}%
                    </span>
                    <span className="text-sm">
                      <span className="font-medium">
                        {formatTemperature(day.temperatureMax, unit)}
                      </span>
                      <span className="ml-1 text-muted-foreground">
                        {formatTemperature(day.temperatureMin, unit)}
                      </span>
                    </span>
                  </div>
                ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
