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

// Load events from localStorage only (no default demo data)
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
  const [events, setEvents] = useState(() => loadEvents());
  const [isLoading, setIsLoading] = useState(false);

  // Save to localStorage whenever events change
  useEffect(() => {
    saveEvents(events);
  }, [events]);

  // Listen for storage events from other tabs/windows (cross-tab sync)
  useEffect(() => {
    const handleStorageChange = (e) => {
      // Only handle storage events from other tabs (cross-tab synchronization)
      if (e.key === STORAGE_KEY) {
        const updatedEvents = loadEvents();
        setEvents(updatedEvents);
      }
    };

    // Listen for browser storage events (cross-tab synchronization)
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const addEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      isMultiDay: eventData.isMultiDay || false,
    };

    setEvents((prevEvents) => {
      return [...prevEvents, newEvent];
    });

    return newEvent;
  };

  const updateEvent = (eventId, updatedData) => {
    setEvents((prevEvents) => {
      return prevEvents.map((event) =>
        event.id === eventId ? { ...event, ...updatedData } : event
      );
    });
  };

  const deleteEvent = (eventId) => {
    setEvents((prevEvents) => {
      return prevEvents.filter((event) => event.id !== eventId);
    });
  };

  const clearAllEvents = () => {
    setEvents([]);
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
