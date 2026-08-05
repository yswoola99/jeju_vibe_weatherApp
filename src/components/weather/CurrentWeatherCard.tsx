import type { ReactNode } from "react";
import {
  AlertTriangle,
  CloudDrizzle,
  Cloudy,
  Droplets,
  Sun,
  Sunrise,
  Sunset,
  Thermometer,
  Wind,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getWeatherCodeInfo, getWeatherTone } from "@/lib/weatherCode";
import { getWeatherCardTheme } from "@/lib/weatherTheme";
import { formatClockTime, formatLocalDateTime, formatTemperature } from "@/lib/format";
import { QUICK_CITIES } from "@/lib/quickCities";
import { useUnit } from "@/context/UnitContext";
import { useLocation } from "@/context/LocationContext";
import { useLiveClock } from "@/hooks/useLiveClock";
import { cn } from "@/lib/utils";
import type { ForecastData } from "@/types/weather";

interface CurrentWeatherCardProps {
  data: ForecastData | undefined;
  isLoading: boolean;
  isError: boolean;
}

export function CurrentWeatherCard({ data, isLoading, isError }: CurrentWeatherCardProps) {
  const { unit } = useUnit();
  const { location, setLocation } = useLocation();
  const now = useLiveClock(1000);

  if (isError) {
    return (
      <Card className="bg-card/70 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center gap-2 py-10 text-muted-foreground">
          <AlertTriangle className="size-8" />
          <p className="text-sm">날씨 정보를 불러오지 못했습니다.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading || !data) {
    return (
      <Card className="bg-card/70 backdrop-blur-sm">
        <CardContent className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="size-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-28" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const { current } = data;
  const today = data.daily[0];
  const { icon: Icon, label } = getWeatherCodeInfo(current.weatherCode, current.isDay);
  const tone = getWeatherTone(current.weatherCode);
  const theme = getWeatherCardTheme(tone, current.isDay);
  const dark = theme.isDark;

  return (
    <Card
      className={cn(
        "overflow-hidden bg-linear-to-br transition-colors duration-700",
        theme.gradientClass,
        dark ? "text-white" : "text-foreground",
      )}
    >
      <CardContent className="flex flex-wrap gap-1.5">
        {QUICK_CITIES.map((city) => {
          const active = city.name === location.name;
          return (
            <Button
              key={city.name}
              size="xs"
              variant={active ? "default" : "outline"}
              onClick={() => setLocation(city)}
              className={cn(
                !active &&
                  dark &&
                  "border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white",
              )}
            >
              {city.name}
            </Button>
          );
        })}
      </CardContent>

      <CardContent>
        <p className={cn("text-xs", dark ? "text-white/70" : "text-muted-foreground")}>
          {formatLocalDateTime(now, data.timezone)}
        </p>
      </CardContent>

      <CardContent className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Icon className={cn("size-16", dark ? "text-white" : "text-primary")} strokeWidth={1.5} />
          <div>
            <p className="text-5xl font-semibold leading-none">
              {formatTemperature(current.temperature, unit)}
            </p>
            <p className={cn("mt-2 text-sm", dark ? "text-white/70" : "text-muted-foreground")}>{label}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <MiniStat
            dark={dark}
            icon={<Thermometer className="size-4" />}
            label="체감온도"
            value={formatTemperature(current.apparentTemperature, unit)}
          />
          <MiniStat
            dark={dark}
            icon={<Droplets className="size-4" />}
            label="습도"
            value={`${current.humidity}%`}
          />
          <MiniStat
            dark={dark}
            icon={<Wind className="size-4" />}
            label="바람"
            value={`${Math.round(current.windSpeed)} km/h`}
          />
          <MiniStat
            dark={dark}
            icon={<CloudDrizzle className="size-4" />}
            label="강수확률"
            value={`${current.precipitationProbability}%`}
          />
          <MiniStat
            dark={dark}
            icon={<Cloudy className="size-4" />}
            label="구름량"
            value={`${current.cloudCover}%`}
          />
          <MiniStat
            dark={dark}
            icon={<Sun className="size-4" />}
            label="자외선"
            value={today ? today.uvIndexMax.toFixed(1) : "-"}
          />
        </div>
      </CardContent>

      {today && (
        <CardContent
          className={cn(
            "flex items-center justify-around gap-4 border-t pt-4 text-sm",
            dark ? "border-white/20 text-white/80" : "border-border/60 text-muted-foreground",
          )}
        >
          <div className="flex items-center gap-2">
            <Sunrise className="size-4" />
            <span>{formatClockTime(today.sunrise)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Sunset className="size-4" />
            <span>{formatClockTime(today.sunset)}</span>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

function MiniStat({
  icon,
  label,
  value,
  dark,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  dark: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-lg px-3 py-2",
        dark ? "bg-white/15" : "bg-muted/50",
      )}
    >
      <div className={cn("flex items-center gap-1.5 text-xs", dark ? "text-white/70" : "text-muted-foreground")}>
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-base font-medium">{value}</p>
    </div>
  );
}
