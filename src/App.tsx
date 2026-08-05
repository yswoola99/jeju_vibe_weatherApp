import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { CurrentWeatherCard } from "@/components/weather/CurrentWeatherCard";
import { HourlyForecastCard } from "@/components/weather/HourlyForecastCard";
import { DailyForecastCard } from "@/components/weather/DailyForecastCard";
import { AirQualityCard } from "@/components/weather/AirQualityCard";
import { WeatherChatWidget } from "@/components/chat/WeatherChatWidget";
import { useLocation } from "@/context/LocationContext";
import { useGeolocationInit } from "@/hooks/useGeolocation";
import { useForecastQuery } from "@/hooks/useForecastQuery";
import { useAirQualityQuery } from "@/hooks/useAirQualityQuery";
import { getWeatherTone } from "@/lib/weatherCode";
import { getPageBackgroundClass } from "@/lib/weatherTheme";

function App() {
  useGeolocationInit();
  const { location } = useLocation();

  const forecastQuery = useForecastQuery(location.latitude, location.longitude);
  const airQualityQuery = useAirQualityQuery(location.latitude, location.longitude);

  useEffect(() => {
    document.title = `${location.name} 날씨`;
  }, [location.name]);

  const tone = forecastQuery.data ? getWeatherTone(forecastQuery.data.current.weatherCode) : "clear";
  const isDay = forecastQuery.data?.current.isDay ?? true;
  const backgroundClass = getPageBackgroundClass(tone, isDay);

  return (
    <div className={`min-h-screen bg-linear-to-b ${backgroundClass} transition-colors duration-700`}>
      <Header />

      <main className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 sm:px-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <CurrentWeatherCard
              data={forecastQuery.data}
              isLoading={forecastQuery.isLoading}
              isError={forecastQuery.isError}
            />
          </div>
          <AirQualityCard
            data={airQualityQuery.data}
            isLoading={airQualityQuery.isLoading}
            isError={airQualityQuery.isError}
          />
        </div>

        <HourlyForecastCard
          data={forecastQuery.data}
          isLoading={forecastQuery.isLoading}
          isError={forecastQuery.isError}
        />

        <DailyForecastCard
          data={forecastQuery.data}
          isLoading={forecastQuery.isLoading}
          isError={forecastQuery.isError}
        />
      </main>

      <WeatherChatWidget
        location={location}
        forecast={forecastQuery.data}
        airQuality={airQualityQuery.data}
      />
    </div>
  );
}

export default App;
