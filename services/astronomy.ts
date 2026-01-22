
import { Coordinates, AltAz } from '../types';

/**
 * Calculates the Julian Date for the current time.
 */
export const getJulianDate = (date: Date): number => {
  return (date.getTime() / 86400000) - (date.getTimezoneOffset() / 1440) + 2440587.5;
};

/**
 * Calculates the Local Sidereal Time (LST) in degrees.
 */
export const getLST = (date: Date, lng: number): number => {
  const jd = getJulianDate(date);
  const d = jd - 2451545.0;
  // Mean Sidereal Time at Greenwich
  let gmst = 280.46061837 + 360.98564736629 * d;
  // Local Sidereal Time
  let lst = (gmst + lng) % 360;
  if (lst < 0) lst += 360;
  return lst;
};

/**
 * Converts Equatorial Coordinates (RA/Dec) to Horizontal Coordinates (Alt/Az).
 */
export const equatorialToHorizontal = (
  ra: number,
  dec: number,
  lat: number,
  lst: number
): AltAz => {
  const rad = Math.PI / 180;
  
  const ha = (lst - ra) * rad; // Hour Angle
  const decRad = dec * rad;
  const latRad = lat * rad;

  // sin(Alt) = sin(Lat)sin(Dec) + cos(Lat)cos(Dec)cos(HA)
  const sinAlt = Math.sin(latRad) * Math.sin(decRad) + 
                 Math.cos(latRad) * Math.cos(decRad) * Math.cos(ha);
  const alt = Math.asin(sinAlt) / rad;

  // cos(Az) = (sin(Dec) - sin(Lat)sin(Alt)) / (cos(Lat)cos(Alt))
  let cosAz = (Math.sin(decRad) - Math.sin(latRad) * sinAlt) / 
              (Math.cos(latRad) * Math.cos(alt * rad));
  
  // Clamp cosAz to [-1, 1] to avoid NaN from floating point errors
  cosAz = Math.max(-1, Math.min(1, cosAz));
  
  let az = Math.acos(cosAz) / rad;
  
  if (Math.sin(ha) > 0) {
    az = 360 - az;
  }

  return { alt, az };
};

/**
 * Simple low-pass filter for smoothing sensor data.
 */
export const lowPassFilter = (prev: number, current: number, alpha: number = 0.1): number => {
  // Handle 0/360 wrap around for angles
  let diff = current - prev;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return (prev + alpha * diff + 360) % 360;
};
