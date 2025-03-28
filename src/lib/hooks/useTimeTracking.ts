import { useEffect, useRef, useCallback } from 'react';

const UPDATE_INTERVAL = 60000; // Update every minute

export function useTimeTracking() {
  const lastUpdateRef = useRef<number>(Date.now());
  const intervalRef = useRef<NodeJS.Timeout>();
  const isUpdatingRef = useRef(false);

  const updateTimeSpent = useCallback(async () => {
    if (isUpdatingRef.current) return;
    
    try {
      isUpdatingRef.current = true;
      const now = Date.now();
      const timeDiff = Math.floor((now - lastUpdateRef.current) / 1000); // Convert to seconds
      
      if (timeDiff > 0) {
        // Use sendBeacon for more reliable data sending during page unload
        const data = new FormData();
        data.append('timeSpent', timeDiff.toString());
        
        try {
          const success = navigator.sendBeacon('/api/time-spent', data);
          if (!success) {
            // Fallback to fetch if sendBeacon fails
            const response = await fetch('/api/time-spent', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ timeSpent: timeDiff }),
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
          }
        } catch (error) {
          console.error('Error updating time spent:', error);
        }
      }
      
      lastUpdateRef.current = now;
    } finally {
      isUpdatingRef.current = false;
    }
  }, []);

  useEffect(() => {
    // Start tracking
    intervalRef.current = setInterval(updateTimeSpent, UPDATE_INTERVAL);

    // Initial update
    updateTimeSpent();

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        updateTimeSpent(); // Final update
      }
    };
  }, [updateTimeSpent]);

  // Function to get current time spent today
  const getTimeSpentToday = useCallback(async () => {
    try {
      const response = await fetch('/api/time-spent');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.timeSpent || 0;
    } catch (error) {
      console.error('Error fetching time spent:', error);
      return 0;
    }
  }, []);

  return { getTimeSpentToday };
} 