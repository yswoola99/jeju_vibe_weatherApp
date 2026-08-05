export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  weatherCode: number;
  isDay: boolean;
  windSpeed: number;
  windDirection: number;
  cloudCover: number;
  precipitationProbability: number;
  time: string;
}

export interface HourlyForecastEntry {
  time: string;
  temperature: number;
  precipitationProbability: number;
  weatherCode: number;
  isDay: boolean;
}

export interface DailyForecastEntry {
  date: string;
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
  precipitationProbability: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
}

export interface ForecastData {
  current: CurrentWeather;
  hourly: HourlyForecastEntry[];
  daily: DailyForecastEntry[];
  timezone: string;
}

export interface AirQualityData {
  pm10: number | null;
  pm2_5: number | null;
  usAqi: number | null;
  europeanAqi: number | null;
  time: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  name: string;
  isCurrentLocation: boolean;
}

export type TemperatureUnit = "C" | "F";
