import { getWeatherVideoSrc } from "@/lib/weatherVideo";
import { cn } from "@/lib/utils";

interface WeatherBackgroundVideoProps {
  code: number;
  isDay: boolean;
}

export function WeatherBackgroundVideo({ code, isDay }: WeatherBackgroundVideoProps) {
  const src = getWeatherVideoSrc(code, isDay);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-900">
      <video
        key={src}
        className="h-full w-full animate-in fade-in object-cover duration-1000"
        src={src}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />
      <div className={cn("absolute inset-0", isDay ? "bg-black/10" : "bg-black/35")} />
    </div>
  );
}
