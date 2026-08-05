const REVERSE_GEOCODE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

export interface ReverseGeocodeResult {
  city: string;
  admin1?: string;
}

// Open-Meteo's geocoding API only supports forward search (name -> coords), so
// resolving the browser's GPS coordinates back to a place name needs a separate,
// key-free reverse-geocoding service.
export async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<ReverseGeocodeResult | null> {
  const url = new URL(REVERSE_GEOCODE_URL);
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("localityLanguage", "ko");

  const res = await fetch(url.toString());
  if (!res.ok) return null;

  const data = await res.json();
  const city: string | undefined = data.city || data.locality;
  if (!city) return null;

  return { city, admin1: data.principalSubdivision || undefined };
}
