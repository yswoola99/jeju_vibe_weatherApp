import { AlertTriangle, Wind } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getAqiInfo } from "@/lib/format";
import type { AirQualityData } from "@/types/weather";

interface AirQualityCardProps {
  data: AirQualityData | undefined;
  isLoading: boolean;
  isError: boolean;
}

export function AirQualityCard({ data, isLoading, isError }: AirQualityCardProps) {
  if (isError) {
    return (
      <Card className="bg-card/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>미세먼지</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
          <AlertTriangle className="size-6" />
          <p className="text-sm">정보를 불러오지 못했습니다.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading || !data) {
    return (
      <Card className="bg-card/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>미세먼지</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Skeleton className="h-7 w-20" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-14" />
            <Skeleton className="h-14" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const aqi = getAqiInfo(data.usAqi);

  return (
    <Card className="bg-card/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wind className="size-4" />
          미세먼지
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Badge className={aqi.colorClass}>{aqi.label}</Badge>
          <span className="text-xs text-muted-foreground">
            {data.usAqi !== null ? `US AQI ${data.usAqi}` : ""}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1 rounded-lg bg-muted/50 px-3 py-2">
            <span className="text-xs text-muted-foreground">PM2.5</span>
            <p className="text-base font-medium">
              {data.pm2_5 !== null ? `${Math.round(data.pm2_5)} µg/m³` : "-"}
            </p>
          </div>
          <div className="flex flex-col gap-1 rounded-lg bg-muted/50 px-3 py-2">
            <span className="text-xs text-muted-foreground">PM10</span>
            <p className="text-base font-medium">
              {data.pm10 !== null ? `${Math.round(data.pm10)} µg/m³` : "-"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
