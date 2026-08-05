import { getWeatherCodeInfo } from "@/lib/weatherCode";
import { cn } from "@/lib/utils";

interface WeatherIconProps {
  code: number;
  isDay: boolean;
  className?: string;
}

export function WeatherIcon({ code, isDay, className }: WeatherIconProps) {
  const { icon: Icon, label } = getWeatherCodeInfo(code, isDay);
  return <Icon aria-label={label} className={cn("shrink-0", className)} />;
}
