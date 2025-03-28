'use client';

import { useTimeTracking } from '@/lib/hooks/useTimeTracking';
import { createContext, useContext, ReactNode } from 'react';

interface TimeTrackingContextType {
  getTimeSpentToday: () => Promise<number>;
}

const TimeTrackingContext = createContext<TimeTrackingContextType | null>(null);

export function useTimeTrackingContext() {
  const context = useContext(TimeTrackingContext);
  if (!context) {
    throw new Error('useTimeTrackingContext must be used within a TimeTrackingProvider');
  }
  return context;
}

export function TimeTrackingProvider({ children }: { children: ReactNode }) {
  const timeTracking = useTimeTracking();

  return (
    <TimeTrackingContext.Provider value={timeTracking}>
      {children}
    </TimeTrackingContext.Provider>
  );
} 