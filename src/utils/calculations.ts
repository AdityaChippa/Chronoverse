import { Vector3 } from '@/types';

export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

export function calculateOrbitalPosition(
  semiMajorAxis: number,
  eccentricity: number,
  trueAnomaly: number
): Vector3 {
  const r = semiMajorAxis * (1 - eccentricity * eccentricity) / 
            (1 + eccentricity * Math.cos(trueAnomaly));
  
  return {
    x: r * Math.cos(trueAnomaly),
    y: r * Math.sin(trueAnomaly),
    z: 0
  };
}

export function calculateDistance(a: Vector3, b: Vector3): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dz = b.z - a.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function normalizeVector(v: Vector3): Vector3 {
  const length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  if (length === 0) return { x: 0, y: 0, z: 0 };
  
  return {
    x: v.x / length,
    y: v.y / length,
    z: v.z / length
  };
}

export function keplerianToCartesian(
  a: number, // semi-major axis
  e: number, // eccentricity
  i: number, // inclination
  omega: number, // longitude of ascending node
  w: number, // argument of periapsis
  M: number, // mean anomaly
  mu: number = 398600.4418 // gravitational parameter (Earth)
): Vector3 {
  // Solve Kepler's equation for eccentric anomaly
  let E = M;
  for (let j = 0; j < 10; j++) {
    E = M + e * Math.sin(E);
  }
  
  // True anomaly
  const v = 2 * Math.atan2(
    Math.sqrt(1 + e) * Math.sin(E / 2),
    Math.sqrt(1 - e) * Math.cos(E / 2)
  );
  
  // Distance
  const r = a * (1 - e * Math.cos(E));
  
  // Position in orbital plane
  const x_orb = r * Math.cos(v);
  const y_orb = r * Math.sin(v);
  
  // Rotation matrices
  const cos_omega = Math.cos(omega);
  const sin_omega = Math.sin(omega);
  const cos_i = Math.cos(i);
  const sin_i = Math.sin(i);
  const cos_w = Math.cos(w);
  const sin_w = Math.sin(w);
  
  // Transform to inertial frame
  const x = (cos_omega * cos_w - sin_omega * sin_w * cos_i) * x_orb +
            (-cos_omega * sin_w - sin_omega * cos_w * cos_i) * y_orb;
  const y = (sin_omega * cos_w + cos_omega * sin_w * cos_i) * x_orb +
            (-sin_omega * sin_w + cos_omega * cos_w * cos_i) * y_orb;
  const z = (sin_w * sin_i) * x_orb + (cos_w * sin_i) * y_orb;
  
  return { x, y, z };
}

export function calculateSatelliteGroundTrack(
  latitude: number,
  longitude: number,
  altitude: number,
  time: number
): { lat: number; lon: number } {
  const earthRadius = 6371; // km
  const orbitalPeriod = 2 * Math.PI * Math.sqrt(
    Math.pow(earthRadius + altitude, 3) / 398600.4418
  );
  
  const angle = (2 * Math.PI * time) / orbitalPeriod;
  
  return {
    lat: latitude,
    lon: (longitude + radiansToDegrees(angle)) % 360
  };
}