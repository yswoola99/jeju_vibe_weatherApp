import { getWeatherCodeInfo } from "@/lib/weatherCode";
import { getAqiInfo } from "@/lib/format";
import type { AirQualityData, ForecastData, Location } from "@/types/weather";

interface WeatherChatContextParams {
  location: Location;
  forecast?: ForecastData;
  airQuality?: AirQualityData;
}

export function buildWeatherSystemPrompt({
  location,
  forecast,
  airQuality,
}: WeatherChatContextParams): string {
  const lines = [
    "너는 날씨 앱 안에 있는 한국어 날씨 챗봇이야.",
    "아래 실시간 날씨 데이터를 근거로 사용자 질문에 짧고 친근하게 답해.",
    "데이터에 없는 내용은 추측하지 말고 모른다고 말하고, 날씨와 무관한 질문에는 날씨 관련 질문만 도와줄 수 있다고 정중히 안내해.",
    "",
    `현재 위치: ${location.name}`,
  ];

  if (!forecast) {
    lines.push("현재 날씨 데이터를 아직 불러오는 중입니다.");
  } else {
    const { current, hourly, daily } = forecast;
    const currentInfo = getWeatherCodeInfo(current.weatherCode, current.isDay);
    lines.push(
      `현재 날씨: ${currentInfo.label}, 기온 ${Math.round(current.temperature)}°C, ` +
        `체감 ${Math.round(current.apparentTemperature)}°C, 습도 ${current.humidity}%, ` +
        `풍속 ${current.windSpeed}km/h`,
    );

    const today = daily[0];
    if (today) {
      lines.push(
        `오늘 최고/최저 기온: ${Math.round(today.temperatureMax)}°C / ${Math.round(today.temperatureMin)}°C, ` +
          `강수확률 ${today.precipitationProbability}%, 자외선지수 ${today.uvIndexMax}, ` +
          `일출 ${formatTime(today.sunrise)}, 일몰 ${formatTime(today.sunset)}`,
      );
    }

    const upcomingHours = hourly.slice(0, 12);
    if (upcomingHours.length > 0) {
      const summary = upcomingHours
        .map((h) => {
          const info = getWeatherCodeInfo(h.weatherCode, h.isDay);
          return `${formatTime(h.time)} ${info.label} ${Math.round(h.temperature)}°C 강수${h.precipitationProbability}%`;
        })
        .join(", ");
      lines.push(`향후 12시간 시간별 예보: ${summary}`);
    }

    const upcomingDays = daily.slice(1, 5);
    if (upcomingDays.length > 0) {
      const summary = upcomingDays
        .map((d) => {
          const info = getWeatherCodeInfo(d.weatherCode, true);
          const weekday = new Date(d.date).toLocaleDateString("ko-KR", { weekday: "short" });
          return `${weekday} ${info.label} ${Math.round(d.temperatureMax)}°/${Math.round(d.temperatureMin)}° 강수${d.precipitationProbability}%`;
        })
        .join(", ");
      lines.push(`이후 며칠 예보: ${summary}`);
    }
  }

  if (airQuality) {
    const aqi = getAqiInfo(airQuality.usAqi);
    lines.push(
      `미세먼지: US AQI ${airQuality.usAqi ?? "정보 없음"} (${aqi.label}), ` +
        `PM2.5 ${airQuality.pm2_5 ?? "정보 없음"}µg/m³, PM10 ${airQuality.pm10 ?? "정보 없음"}µg/m³`,
    );
  }

  return lines.join("\n");
}

function formatTime(isoTime: string): string {
  return new Date(isoTime).toLocaleTimeString("ko-KR", { hour: "numeric", minute: "2-digit", hour12: true });
}
