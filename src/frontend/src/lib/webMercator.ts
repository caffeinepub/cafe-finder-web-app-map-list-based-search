// Web Mercator projection utilities for worldwide tile map rendering

const TILE_SIZE = 256;

// Web Mercator latitude bounds (approximately ±85.05°)
const MAX_LATITUDE = 85.0511287798;
const MIN_LATITUDE = -85.0511287798;

/**
 * Clamp latitude to valid Web Mercator range
 */
export function clampLatitude(lat: number): number {
  return Math.max(MIN_LATITUDE, Math.min(MAX_LATITUDE, lat));
}

/**
 * Normalize longitude to [-180, 180) range
 */
export function normalizeLongitude(lng: number): number {
  while (lng < -180) lng += 360;
  while (lng >= 180) lng -= 360;
  return lng;
}

/**
 * Convert lat/lng to tile coordinates at given zoom level
 */
export function latLngToTile(lat: number, lng: number, zoom: number): { x: number; y: number } {
  const clampedLat = clampLatitude(lat);
  const normalizedLng = normalizeLongitude(lng);
  
  const x = ((normalizedLng + 180) / 360) * Math.pow(2, zoom);
  const y =
    ((1 -
      Math.log(Math.tan((clampedLat * Math.PI) / 180) + 1 / Math.cos((clampedLat * Math.PI) / 180)) /
        Math.PI) /
      2) *
    Math.pow(2, zoom);
  
  return { x, y };
}

/**
 * Convert lat/lng to pixel coordinates at given zoom level
 */
export function latLngToPixel(lat: number, lng: number, zoom: number): { x: number; y: number } {
  const tile = latLngToTile(lat, lng, zoom);
  return {
    x: tile.x * TILE_SIZE,
    y: tile.y * TILE_SIZE,
  };
}

/**
 * Wrap tile X coordinate to valid range for given zoom level
 * Tiles wrap horizontally (longitude wraps around the world)
 */
export function wrapTileX(tileX: number, zoom: number): number {
  const maxTile = Math.pow(2, zoom);
  let wrapped = tileX % maxTile;
  if (wrapped < 0) wrapped += maxTile;
  return wrapped;
}

/**
 * Clamp tile Y coordinate to valid range for given zoom level
 * Tiles don't wrap vertically (latitude is bounded)
 */
export function clampTileY(tileY: number, zoom: number): number {
  const maxTile = Math.pow(2, zoom) - 1;
  return Math.max(0, Math.min(maxTile, tileY));
}

/**
 * Convert pixel coordinates back to lat/lng at given zoom level
 */
export function pixelToLatLng(pixelX: number, pixelY: number, zoom: number): { lat: number; lng: number } {
  const n = Math.pow(2, zoom);
  const lng = (pixelX / TILE_SIZE / n) * 360 - 180;
  const latRad = Math.atan(Math.sinh(Math.PI - (2 * Math.PI * pixelY) / TILE_SIZE / n));
  const lat = (latRad * 180) / Math.PI;
  
  return {
    lat: clampLatitude(lat),
    lng: normalizeLongitude(lng),
  };
}

export { TILE_SIZE };
