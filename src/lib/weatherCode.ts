import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  type LucideIcon,
} from "lucide-react";

export interface WeatherCodeInfo {
  label: string;
  icon: LucideIcon;
}

interface WeatherCodeVariants {
  label: string;
  dayIcon: LucideIcon;
  nightIcon: LucideIcon;
}

const WEATHER_CODE_MAP: Record<number, WeatherCodeVariants> = {
  0: { label: "맑음", dayIcon: Sun, nightIcon: Moon },
  1: { label: "대체로 맑음", dayIcon: CloudSun, nightIcon: CloudMoon },
  2: { label: "구름 조금", dayIcon: CloudSun, nightIcon: CloudMoon },
  3: { label: "흐림", dayIcon: Cloud, nightIcon: Cloud },
  45: { label: "안개", dayIcon: CloudFog, nightIcon: CloudFog },
  48: { label: "짙은 안개", dayIcon: CloudFog, nightIcon: CloudFog },
  51: { label: "약한 이슬비", dayIcon: CloudDrizzle, nightIcon: CloudDrizzle },
  53: { label: "이슬비", dayIcon: CloudDrizzle, nightIcon: CloudDrizzle },
  55: { label: "강한 이슬비", dayIcon: CloudDrizzle, nightIcon: CloudDrizzle },
  56: { label: "약한 착빙성 이슬비", dayIcon: CloudDrizzle, nightIcon: CloudDrizzle },
  57: { label: "착빙성 이슬비", dayIcon: CloudDrizzle, nightIcon: CloudDrizzle },
  61: { label: "약한 비", dayIcon: CloudRain, nightIcon: CloudRain },
  63: { label: "비", dayIcon: CloudRain, nightIcon: CloudRain },
  65: { label: "강한 비", dayIcon: CloudRain, nightIcon: CloudRain },
  66: { label: "약한 착빙성 비", dayIcon: CloudRain, nightIcon: CloudRain },
  67: { label: "착빙성 비", dayIcon: CloudRain, nightIcon: CloudRain },
  71: { label: "약한 눈", dayIcon: CloudSnow, nightIcon: CloudSnow },
  73: { label: "눈", dayIcon: CloudSnow, nightIcon: CloudSnow },
  75: { label: "강한 눈", dayIcon: CloudSnow, nightIcon: CloudSnow },
  77: { label: "싸락눈", dayIcon: CloudSnow, nightIcon: CloudSnow },
  80: { label: "약한 소나기", dayIcon: CloudRain, nightIcon: CloudRain },
  81: { label: "소나기", dayIcon: CloudRain, nightIcon: CloudRain },
  82: { label: "강한 소나기", dayIcon: CloudRain, nightIcon: CloudRain },
  85: { label: "약한 눈 소나기", dayIcon: CloudSnow, nightIcon: CloudSnow },
  86: { label: "강한 눈 소나기", dayIcon: CloudSnow, nightIcon: CloudSnow },
  95: { label: "뇌우", dayIcon: CloudLightning, nightIcon: CloudLightning },
  96: { label: "우박 동반 뇌우", dayIcon: CloudLightning, nightIcon: CloudLightning },
  99: { label: "강한 우박 동반 뇌우", dayIcon: CloudLightning, nightIcon: CloudLightning },
};

export function getWeatherCodeInfo(code: number, isDay: boolean): WeatherCodeInfo {
  const variants = WEATHER_CODE_MAP[code] ?? WEATHER_CODE_MAP[3];
  return {
    label: variants.label,
    icon: isDay ? variants.dayIcon : variants.nightIcon,
  };
}

export type WeatherTone = "clear" | "cloudy" | "rain" | "snow" | "storm";

export function getWeatherTone(code: number): WeatherTone {
  if (code === 0 || code === 1) return "clear";
  if ([2, 3, 45, 48].includes(code)) return "cloudy";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "snow";
  if ([95, 96, 99].includes(code)) return "storm";
  return "rain";
}
