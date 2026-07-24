export const ADMIN_STORE_LAT = Number(process.env.ADMIN_STORE_LAT ?? 22.5726); // Default: Salt Lake / Kolkata
export const ADMIN_STORE_LNG = Number(process.env.ADMIN_STORE_LNG ?? 88.3639);

/**
 * Calculates the great-circle distance between two points on Earth using the Haversine formula.
 * @returns Distance in meters
 */
export function calculateDistanceInMeters(
  lat1: number | null | undefined,
  lon1: number | null | undefined,
  lat2: number = ADMIN_STORE_LAT,
  lon2: number = ADMIN_STORE_LNG
): number | null {
  if (lat1 === null || lat1 === undefined || lon1 === null || lon1 === undefined || isNaN(lat1) || isNaN(lon1)) {
    return null;
  }

  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Formats meters into human-readable text (e.g., "850 m" or "4.2 km (4,200 m)")
 */
export function formatDistance(meters: number | null | undefined): string {
  if (meters === null || meters === undefined) return "Location N/A";
  if (meters < 1000) return `${meters} m`;
  const km = (meters / 1000).toFixed(1);
  return `${km} km (${meters.toLocaleString()} m)`;
}
