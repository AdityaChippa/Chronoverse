// Add this export at the end of your Timeline.tsx file
// Or replace the entire file with this:

export function Timeline() {
  return (
    <div className="timeline-container">
      {/* Your timeline component code here */}
      <h2>Timeline Component</h2>
    </div>
  );
}

// If you have a default export, change it to named export:
// export default Timeline; → export { Timeline };// Core Types
export interface SpaceEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: EventType;
  significance: number;
  category: string;
  country?: string;
  agency?: string;
  imageUrl?: string;
  videoUrl?: string;
  metadata?: Record<string, any>;
}

export enum EventType {
  LAUNCH = 'LAUNCH',
  LANDING = 'LANDING',
  DISCOVERY = 'DISCOVERY',
  MILESTONE = 'MILESTONE',
  DISASTER = 'DISASTER',
  OBSERVATION = 'OBSERVATION',
  ACHIEVEMENT = 'ACHIEVEMENT'
}

export interface Mission {
  id: string;
  name: string;
  agency: string;
  launchDate: Date;
  endDate?: Date;
  status: MissionStatus;
  description: string;
  objectives: string[];
  achievements: string[];
  spacecraft?: string;
  destination?: string;
  imageUrl?: string;
  metadata?: Record<string, any>;
}

export enum MissionStatus {
  PLANNED = 'PLANNED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export interface Satellite {
  id: string;
  noradId: string;
  name: string;
  type: string;
  country: string;
  launchDate: Date;
  orbitType: string;
  altitude?: number;
  inclination?: number;
  period?: number;
  isActive: boolean;
  tleData?: TLEData;
  position?: SatellitePosition;
}

export interface TLEData {
  line1: string;
  line2: string;
  epoch: Date;
}

export interface SatellitePosition {
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
}

export interface CelestialBody {
  id: string;
  name: string;
  type: 'planet' | 'moon' | 'asteroid' | 'comet';
  position: Vector3;
  radius: number;
  mass: number;
  texture?: string;
  orbit?: OrbitData;
}

export interface OrbitData {
  semiMajorAxis: number;
  eccentricity: number;
  inclination: number;
  longitudeOfAscendingNode: number;
  argumentOfPeriapsis: number;
  meanAnomaly: number;
  period: number;
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface LunarPhase {
  phase: string;
  illumination: number;
  age: number;
  distance: number;
  nextNewMoon: Date;
  nextFullMoon: Date;
}

export interface Constellation {
  id: string;
  name: string;
  abbreviation: string;
  stars: Star[];
  lines: number[][];
  mythology: string;
  bestViewing: string;
}

export interface Star {
  id: string;
  name: string;
  position: Vector3;
  magnitude: number;
  spectralType: string;
  distance: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  publishedAt: Date;
  imageUrl?: string;
  tags: string[];
  url: string;
}

export interface CosmicJournal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  isPublic: boolean;
  entries: JournalEntry[];
  createdAt: Date;
  updatedAt: Date;
}

export interface JournalEntry {
  id: string;
  journalId: string;
  eventId?: string;
  title: string;
  content: string;
  date: Date;
  imageUrl?: string;
  event?: SpaceEvent;
}

export interface Achievement {
  id: string;
  type: AchievementType;
  name: string;
  description: string;
  earnedAt: Date;
  progress?: number;
  maxProgress?: number;
}

export enum AchievementType {
  EXPLORER = 'EXPLORER',
  RESEARCHER = 'RESEARCHER',
  VOYAGER = 'VOYAGER',
  PIONEER = 'PIONEER',
  COMMANDER = 'COMMANDER',
  ASTRONOMER = 'ASTRONOMER'
}

export interface UserPreferences {
  language: string;
  voiceEnabled: boolean;
  hapticEnabled: boolean;
  soundEnabled: boolean;
  theme: 'dark' | 'light';
  notifications: boolean;
}

export interface TimeRange {
  start: Date;
  end: Date;
}

export interface FilterOptions {
  eventTypes?: EventType[];
  categories?: string[];
  agencies?: string[];
  countries?: string[];
  dateRange?: TimeRange;
  significance?: number;
  searchQuery?: string;
}

export interface AIResponse {
  message: string;
  suggestions?: string[];
  relatedEvents?: SpaceEvent[];
  visualData?: any;
}

export interface ClassroomSession {
  id: string;
  classroomId: string;
  title: string;
  content: any;
  participants: string[];
  isActive: boolean;
  startedAt: Date;
}