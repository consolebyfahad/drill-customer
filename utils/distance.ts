/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in meters
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371000; // Earth's radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in meters
  return distance;
};

/**
 * Check if provider is within specified range (in meters) of customer
 */
export const isWithinRange = (
  customerLat: number,
  customerLng: number,
  providerLat: number,
  providerLng: number,
  rangeMeters: number = 300
): boolean => {
  const distance = calculateDistance(
    customerLat,
    customerLng,
    providerLat,
    providerLng
  );
  console.log(`📍 Distance check: ${distance.toFixed(2)}m (range: ${rangeMeters}m)`);
  return distance <= rangeMeters;
};

