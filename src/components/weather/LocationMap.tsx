import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Location } from "@/types/weather";

interface LocationMapProps {
  location: Location;
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

export function LocationMap({ location }: LocationMapProps) {
  return (
    <Card className="bg-card/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="size-4 text-primary" />
          지도
        </CardTitle>
      </CardHeader>
      <CardContent>
        {GOOGLE_MAPS_API_KEY ? (
          <iframe
            key={`${location.latitude},${location.longitude}`}
            title={`${location.name} 지도`}
            className="h-72 w-full rounded-lg border-0 sm:h-96"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${location.latitude},${location.longitude}&zoom=11`}
          />
        ) : (
          <div className="flex h-72 flex-col items-center justify-center gap-2 rounded-lg bg-muted/50 px-4 text-center text-sm text-muted-foreground sm:h-96">
            <MapPin className="size-6" />
            <p>
              지도를 표시하려면 <code className="rounded bg-muted px-1 py-0.5">.env</code>에{" "}
              <code className="rounded bg-muted px-1 py-0.5">VITE_GOOGLE_MAPS_API_KEY</code>를
              설정하세요.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
