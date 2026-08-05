import type {
  AirQualityData,
  DailyForecastEntry,
  ForecastData,
  GeocodingResult,
  HourlyForecastEntry,
} from "@/types/weather";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";

// Open-Meteo's geocoding API only matches place names in Latin script, so
// Korean-script queries (e.g. "제주") return zero results even with
// language=ko (that param only localizes the response, not the search).
// Route common Korean city names to their romanized form before searching.
const KOREAN_CITY_ALIASES: Record<string, string> = {
  서울: "Seoul",
  부산: "Busan",
  제주: "Jeju",
  제주시: "Jeju",
  제주도: "Jejudo",
  인천: "Incheon",
  대구: "Daegu",
  대전: "Daejeon",
  광주: "Gwangju",
  울산: "Ulsan",
  수원: "Suwon",
  성남: "Seongnam",
  고양: "Goyang",
  용인: "Yongin",
  청주: "Cheongju",
  전주: "Jeonju",
  천안: "Cheonan",
  안산: "Ansan",
  안양: "Anyang",
  포항: "Pohang",
  창원: "Changwon",
  김해: "Gimhae",
  여수: "Yeosu",
  순천: "Suncheon",
  목포: "Mokpo",
  춘천: "Chuncheon",
  강릉: "Gangneung",
  속초: "Sokcho",
  경주: "Gyeongju",
  통영: "Tongyeong",
  거제: "Geoje",
  세종: "Sejong",
};

interface RawGeocodingResponse {
  results?: {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country?: string;
    admin1?: string;
  }[];
}

export async function searchCities(query: string): Promise<GeocodingResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];
  const url = new URL(GEOCODING_URL);
  url.searchParams.set("name", KOREAN_CITY_ALIASES[trimmed] ?? trimmed);
  url.searchParams.set("count", "8");
  url.searchParams.set("language", "ko");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("도시 검색에 실패했습니다.");
  const data: RawGeocodingResponse = await res.json();

  return (data.results ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    latitude: r.latitude,
    longitude: r.longitude,
    country: r.country,
    admin1: r.admin1,
  }));
}

interface RawForecastResponse {
  timezone: string;
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    weather_code: number;
    is_day: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    cloud_cover: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    weather_code: number[];
    is_day: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
  };
}

function findCurrentHourIndex(times: string[], now: Date): number {
  const hourStart = new Date(now);
  hourStart.setMinutes(0, 0, 0);
  const idx = times.findIndex((t) => new Date(t).getTime() >= hourStart.getTime());
  return idx === -1 ? 0 : idx;
}

export async function fetchForecast(latitude: number, longitude: number): Promise<ForecastData> {
  const url = new URL(FORECAST_URL);
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set(
    "current",
    "temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,is_day,wind_speed_10m,wind_direction_10m,cloud_cover",
  );
  url.searchParams.set(
    "hourly",
    "temperature_2m,precipitation_probability,weather_code,is_day",
  );
  url.searchParams.set(
    "daily",
    "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,uv_index_max",
  );
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", "7");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("날씨 정보를 불러오지 못했습니다.");
  const data: RawForecastResponse = await res.json();

  const startIndex = findCurrentHourIndex(data.hourly.time, new Date());
  const hourly: HourlyForecastEntry[] = data.hourly.time
    .slice(startIndex, startIndex + 24)
    .map((time, i) => {
      const idx = startIndex + i;
      return {
        time,
        temperature: data.hourly.temperature_2m[idx],
        precipitationProbability: data.hourly.precipitation_probability[idx],
        weatherCode: data.hourly.weather_code[idx],
        isDay: data.hourly.is_day[idx] === 1,
      };
    });

  const daily: DailyForecastEntry[] = data.daily.time.map((date, idx) => ({
    date,
    weatherCode: data.daily.weather_code[idx],
    temperatureMax: data.daily.temperature_2m_max[idx],
    temperatureMin: data.daily.temperature_2m_min[idx],
    precipitationProbability: data.daily.precipitation_probability_max[idx],
    sunrise: data.daily.sunrise[idx],
    sunset: data.daily.sunset[idx],
    uvIndexMax: data.daily.uv_index_max[idx],
  }));

  return {
    timezone: data.timezone,
    current: {
      time: data.current.time,
      temperature: data.current.temperature_2m,
      apparentTemperature: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      weatherCode: data.current.weather_code,
      isDay: data.current.is_day === 1,
      windSpeed: data.current.wind_speed_10m,
      windDirection: data.current.wind_direction_10m,
      cloudCover: data.current.cloud_cover,
      precipitationProbability: data.hourly.precipitation_probability[startIndex] ?? 0,
    },
    hourly,
    daily,
  };
}

interface RawAirQualityResponse {
  current: {
    time: string;
    pm10: number | null;
    pm2_5: number | null;
    us_aqi: number | null;
    european_aqi: number | null;
  };
}

export async function fetchAirQuality(latitude: number, longitude: number): Promise<AirQualityData> {
  const url = new URL(AIR_QUALITY_URL);
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("current", "pm10,pm2_5,us_aqi,european_aqi");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("미세먼지 정보를 불러오지 못했습니다.");
  const data: RawAirQualityResponse = await res.json();

  return {
    time: data.current.time,
    pm10: data.current.pm10,
    pm2_5: data.current.pm2_5,
    usAqi: data.current.us_aqi,
    europeanAqi: data.current.european_aqi,
  };
}
