import React, { createContext, useContext, useState, useEffect } from 'react';

const EventsContext = createContext();

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};

const STORAGE_KEY = 'ngo-calendar-events';
const SYNC_INTERVAL = 3000; // Sync every 3 seconds
const SHARED_STORAGE_KEY = 'ngo-calendar-shared-events';

// Load events from localStorage
const loadEvents = () => {
  try {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    }
  } catch (error) {
    console.error('Error loading events from localStorage:', error);
  }
  // Return empty array instead of demo data
  return [];
};

// Load shared events from localStorage (using a shared key that all users can access)
// Note: This works within the same domain. For true cross-user sync, a backend API is needed.
const loadSharedEvents = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const shared = localStorage.getItem(SHARED_STORAGE_KEY);
      if (shared) {
        return JSON.parse(shared);
      }
    }
  } catch (error) {
    console.error('Error loading shared events:', error);
  }
  return null;
};

// Save shared events to localStorage (shared key for all users on same domain)
const saveSharedEvents = (events) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(SHARED_STORAGE_KEY, JSON.stringify(events));
      // Broadcast to other tabs/windows
      window.dispatchEvent(new CustomEvent('sharedEventsUpdated', { detail: events }));
      // Also trigger storage event for cross-tab sync
      window.dispatchEvent(new StorageEvent('storage', { key: SHARED_STORAGE_KEY }));
    }
  } catch (error) {
    console.error('Error saving shared events:', error);
  }
};

// Save events to localStorage
const saveEvents = (events) => {
  try {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    }
  } catch (error) {
    console.error('Error saving events to localStorage:', error);
  }
};

export const EventsProvider = ({ children }) => {
  // Initialize with shared events if available, otherwise localStorage
  const initializeEvents = () => {
    const sharedEvents = loadSharedEvents();
    if (sharedEvents && sharedEvents.length > 0) {
      return sharedEvents;
    }
    return loadEvents();
  };

  const [events, setEvents] = useState(() => initializeEvents());
  const [isLoading, setIsLoading] = useState(false);

  // Save to both localStorage and sessionStorage whenever events change
  useEffect(() => {
    saveEvents(events);
    saveSharedEvents(events);
  }, [events]);

  // Listen for shared events updates from other tabs/windows
  useEffect(() => {
    const handleSharedEventsUpdate = (e) => {
      if (e.detail && Array.isArray(e.detail)) {
        setEvents(e.detail);
      }
    };

    const handleStorageChange = (e) => {
      // Handle localStorage changes from other tabs
      if (e.key === STORAGE_KEY) {
        const updatedEvents = loadEvents();
        setEvents(updatedEvents);
        saveSharedEvents(updatedEvents);
      }
      // Handle sessionStorage changes from other tabs
      if (e.key === SHARED_STORAGE_KEY) {
        const sharedEvents = loadSharedEvents();
        if (sharedEvents) {
          setEvents(sharedEvents);
        }
      }
    };

    // Listen for custom shared events
    window.addEventListener('sharedEventsUpdated', handleSharedEventsUpdate);
    
    // Listen for browser storage events (cross-tab synchronization)
    window.addEventListener('storage', handleStorageChange);

    // Poll for shared events updates (for cross-user sync)
    const syncInterval = setInterval(() => {
      const sharedEvents = loadSharedEvents();
      if (sharedEvents && sharedEvents.length > 0) {
        setEvents(sharedEvents);
      }
    }, SYNC_INTERVAL);

    return () => {
      window.removeEventListener('sharedEventsUpdated', handleSharedEventsUpdate);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(syncInterval);
    };
  }, []);

  // Sync events on mount and periodically
  useEffect(() => {
    const sharedEvents = loadSharedEvents();
    if (sharedEvents && sharedEvents.length > 0) {
      setEvents(sharedEvents);
    }
  }, []);

  const addEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      isMultiDay: eventData.isMultiDay || false,
    };

    setEvents((prevEvents) => {
      const updated = [...prevEvents, newEvent];
      // Immediately sync to shared storage
      saveSharedEvents(updated);
      return updated;
    });

    return newEvent;
  };

  const updateEvent = (eventId, updatedData) => {
    setEvents((prevEvents) => {
      const updated = prevEvents.map((event) =>
        event.id === eventId ? { ...event, ...updatedData } : event
      );
      saveSharedEvents(updated);
      return updated;
    });
  };

  const deleteEvent = (eventId) => {
    setEvents((prevEvents) => {
      const updated = prevEvents.filter((event) => event.id !== eventId);
      saveSharedEvents(updated);
      return updated;
    });
  };

  const clearAllEvents = () => {
    setEvents([]);
    saveSharedEvents([]);
  };

  const value = {
    events,
    isLoading,
    addEvent,
    updateEvent,
    deleteEvent,
    clearAllEvents,
  };

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  );
};
