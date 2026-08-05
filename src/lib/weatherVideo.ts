import clearDay from "@/assets/weather-videos/clear-day.mp4";
import clearNight from "@/assets/weather-videos/clear-night.mp4";
import partlyCloudyDay from "@/assets/weather-videos/partly-cloudy-day.mp4";
import partlyCloudyNight from "@/assets/weather-videos/partly-cloudy-night.mp4";
import cloudyDay from "@/assets/weather-videos/cloudy-day.mp4";
import cloudyNight from "@/assets/weather-videos/cloudy-night.mp4";
import fogDay from "@/assets/weather-videos/fog-day.mp4";
import fogNight from "@/assets/weather-videos/fog-night.mp4";
import rainDay from "@/assets/weather-videos/rain-day.mp4";
import rainNight from "@/assets/weather-videos/rain-night.mp4";
import snowDay from "@/assets/weather-videos/snow-day.mp4";
import snowNight from "@/assets/weather-videos/snow-night.mp4";
import thunderstormDay from "@/assets/weather-videos/thunderstorm-day.mp4";
import thunderstormNight from "@/assets/weather-videos/thunderstorm-night.mp4";

type VideoTone = "clear" | "partly-cloudy" | "cloudy" | "fog" | "rain" | "snow" | "thunderstorm";

const VIDEO_BY_TONE: Record<VideoTone, { day: string; night: string }> = {
  clear: { day: clearDay, night: clearNight },
  "partly-cloudy": { day: partlyCloudyDay, night: partlyCloudyNight },
  cloudy: { day: cloudyDay, night: cloudyNight },
  fog: { day: fogDay, night: fogNight },
  rain: { day: rainDay, night: rainNight },
  snow: { day: snowDay, night: snowNight },
  thunderstorm: { day: thunderstormDay, night: thunderstormNight },
};

// WMO weather codes (https://open-meteo.com/en/docs) mapped to the closest of
// the 7 available video moods.
function getVideoTone(code: number): VideoTone {
  if (code === 0) return "clear";
  if (code === 1) return "clear";
  if (code === 2) return "partly-cloudy";
  if (code === 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "snow";
  if ([95, 96, 99].includes(code)) return "thunderstorm";
  // Drizzle (51-57), rain (61-67), and rain showers (80-82) all fall back to rain.
  return "rain";
}

export function getWeatherVideoSrc(code: number, isDay: boolean): string {
  const tone = getVideoTone(code);
  return isDay ? VIDEO_BY_TONE[tone].day : VIDEO_BY_TONE[tone].night;
}
