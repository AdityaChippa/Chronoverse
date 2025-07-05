// types/spaceEventExtensions.ts
// This file extends the SpaceEvent type for the launches page without modifying the original

import { SpaceEvent as BaseSpaceEvent } from './index';

// Extended SpaceEvent type for launches page
export interface SpaceEvent extends BaseSpaceEvent {
  location?: string;
  details?: string;
}

// Re-export everything else from the main types file
export * from './index';