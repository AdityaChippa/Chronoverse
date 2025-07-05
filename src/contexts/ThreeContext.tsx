'use client';

import { createContext, useContext, ReactNode } from 'react';

interface ThreeContextType {
  // Add Three.js related state and methods here
}

const ThreeContext = createContext<ThreeContextType | undefined>(undefined);

export function ThreeProvider({ children }: { children: ReactNode }) {
  return (
    <ThreeContext.Provider value={{}}>
      {children}
    </ThreeContext.Provider>
  );
}

export function useThreeContext() {
  const context = useContext(ThreeContext);
  if (!context) {
    throw new Error('useThreeContext must be used within ThreeProvider');
  }
  return context;
}