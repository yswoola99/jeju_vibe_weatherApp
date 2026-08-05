import { useEffect, useState } from "react";
import { useLocation } from "@/context/LocationContext";
import { reverseGeocode } from "@/lib/reverseGeocode";
import { formatLocationLabel } from "@/lib/format";

type GeolocationStatus = "locating" | "done";

export function useGeolocationInit(): GeolocationStatus {
  const { setLocation } = useLocation();
  const [status, setStatus] = useState<GeolocationStatus>("locating");

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus("done");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude, name: "현재 위치", isCurrentLocation: true });
        setStatus("done");

        reverseGeocode(latitude, longitude)
          .then((result) => {
            if (!result) return;
            setLocation({
              latitude,
              longitude,
              name: formatLocationLabel(result.city, result.admin1),
              isCurrentLocation: true,
            });
          })
          .catch(() => {
            // Keep the "현재 위치" fallback name already set above.
          });
      },
      () => setStatus("done"),
      { timeout: 8000 },
    );
    // Only run once on mount: this is a one-time initial-location resolution,
    // not a live subscription to location changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return status;
}
