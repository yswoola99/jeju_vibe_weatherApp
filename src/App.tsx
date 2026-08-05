import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { CurrentWeatherCard } from "@/components/weather/CurrentWeatherCard";
import { HourlyForecastCard } from "@/components/weather/HourlyForecastCard";
import { DailyForecastCard } from "@/components/weather/DailyForecastCard";
import { AirQualityCard } from "@/components/weather/AirQualityCard";
import { WeatherChatWidget } from "@/components/chat/WeatherChatWidget";
import { WeatherBackgroundVideo } from "@/components/weather/WeatherBackgroundVideo";
import { useLocation } from "@/context/LocationContext";
import { useGeolocationInit } from "@/hooks/useGeolocation";
import { useForecastQuery } from "@/hooks/useForecastQuery";
import { useAirQualityQuery } from "@/hooks/useAirQualityQuery";

function App() {
  useGeolocationInit();
  const { location } = useLocation();

  const forecastQuery = useForecastQuery(location.latitude, location.longitude);
  const airQualityQuery = useAirQualityQuery(location.latitude, location.longitude);

  useEffect(() => {
    document.title = `${location.name} 날씨`;
  }, [location.name]);

  const weatherCode = forecastQuery.data?.current.weatherCode ?? 0;
  const isDay = forecastQuery.data?.current.isDay ?? true;

  return (
    <div className="relative min-h-screen">
      <WeatherBackgroundVideo code={weatherCode} isDay={isDay} />

      <Header />

      <div className="relative px-4 pt-8 pb-2 text-center sm:pt-10">
        <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)] sm:text-3xl">
          날씨를 알려드립니다.
        </h1>
      </div>

      <main className="relative mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 sm:px-6">
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
