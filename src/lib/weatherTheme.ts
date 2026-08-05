import type { WeatherTone } from "@/lib/weatherCode";

const PAGE_BACKGROUND: Record<WeatherTone, { day: string; night: string }> = {
  clear: { day: "from-sky-300 via-sky-100 to-amber-50", night: "from-slate-950 via-indigo-950 to-slate-900" },
  cloudy: { day: "from-slate-300 via-slate-200 to-slate-100", night: "from-slate-800 via-slate-900 to-slate-950" },
  rain: { day: "from-slate-500 via-slate-400 to-sky-200", night: "from-slate-900 via-slate-800 to-indigo-950" },
  snow: { day: "from-sky-100 via-slate-100 to-white", night: "from-slate-700 via-slate-800 to-slate-900" },
  storm: { day: "from-slate-700 via-slate-800 to-slate-950", night: "from-slate-900 via-black to-slate-950" },
};

export function getPageBackgroundClass(tone: WeatherTone, isDay: boolean): string {
  return isDay ? PAGE_BACKGROUND[tone].day : PAGE_BACKGROUND[tone].night;
}

const CARD_GRADIENT: Record<WeatherTone, { day: string; night: string }> = {
  clear: { day: "from-amber-200 via-sky-200 to-sky-100", night: "from-indigo-950 via-slate-900 to-black" },
  cloudy: { day: "from-slate-300 via-slate-200 to-white", night: "from-slate-700 via-slate-800 to-slate-950" },
  rain: { day: "from-sky-300 via-sky-200 to-slate-100", night: "from-slate-800 via-indigo-950 to-slate-950" },
  snow: { day: "from-sky-100 via-white to-slate-100", night: "from-slate-600 via-slate-700 to-slate-800" },
  storm: { day: "from-slate-500 via-slate-600 to-slate-800", night: "from-black via-slate-900 to-slate-950" },
};

export interface WeatherCardTheme {
  gradientClass: string;
  isDark: boolean;
}

export function getWeatherCardTheme(tone: WeatherTone, isDay: boolean): WeatherCardTheme {
  return {
    gradientClass: isDay ? CARD_GRADIENT[tone].day : CARD_GRADIENT[tone].night,
    // Storms read as dark and moody even in daytime; every other tone follows day/night.
    isDark: !isDay || tone === "storm",
  };
}
