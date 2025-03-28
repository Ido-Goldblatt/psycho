'use client';

import { useTimeTrackingContext } from './TimeTrackingProvider';
import { useEffect } from 'react';

export default function TimeTrackingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getTimeSpentToday } = useTimeTrackingContext();

  useEffect(() => {
    // Handle visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Update time when tab becomes visible
        getTimeSpentToday();
      }
    };

    // Handle page unload
    const handleBeforeUnload = () => {
      // Final update before page unload
      getTimeSpentToday();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Initial time update
    getTimeSpentToday();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Final update on cleanup
      getTimeSpentToday();
    };
  }, [getTimeSpentToday]);

  return (
    <>
      {children}
    </>
  );
} 