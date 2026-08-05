import type { TemperatureUnit } from "@/types/weather";

export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function formatTemperature(celsius: number, unit: TemperatureUnit): string {
  const value = unit === "F" ? celsiusToFahrenheit(celsius) : celsius;
  return `${Math.round(value)}°`;
}

export function formatHour(isoTime: string): string {
  const date = new Date(isoTime);
  return date.toLocaleTimeString("ko-KR", { hour: "numeric", hour12: true });
}

export function formatWeekday(isoDate: string): string {
  const date = new Date(isoDate);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return "오늘";
  return date.toLocaleDateString("ko-KR", { weekday: "short" });
}

export function formatClockTime(isoTime: string): string {
  const date = new Date(isoTime);
  return date.toLocaleTimeString("ko-KR", { hour: "numeric", minute: "2-digit", hour12: true });
}

export function formatLocalDateTime(date: Date, timezone: string): string {
  return date.toLocaleString("ko-KR", {
    timeZone: timezone,
    month: "long",
    day: "numeric",
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatLocationLabel(name: string, admin1?: string): string {
  return [name, admin1].filter(Boolean).join(", ");
}

export interface AqiInfo {
  label: string;
  colorClass: string;
}

export function getAqiInfo(usAqi: number | null): AqiInfo {
  if (usAqi === null) return { label: "정보 없음", colorClass: "bg-muted text-muted-foreground" };
  if (usAqi <= 50) return { label: "좋음", colorClass: "bg-emerald-500 text-white" };
  if (usAqi <= 100) return { label: "보통", colorClass: "bg-yellow-500 text-white" };
  if (usAqi <= 150) return { label: "민감군 나쁨", colorClass: "bg-orange-500 text-white" };
  if (usAqi <= 200) return { label: "나쁨", colorClass: "bg-red-500 text-white" };
  if (usAqi <= 300) return { label: "매우 나쁨", colorClass: "bg-purple-600 text-white" };
  return { label: "위험", colorClass: "bg-rose-900 text-white" };
}
