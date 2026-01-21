import React, { createContext, useContext, useState, useEffect } from 'react';

const EventsContext = createContext();

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};

const API_URL = '/api/events';
const SYNC_INTERVAL = 5000; // Sync every 5 seconds
const STORAGE_KEY = 'ngo-calendar-events'; // Fallback for offline

// Fetch events from API
const fetchEventsFromAPI = async () => {
  try {
    const response = await fetch(API_URL);
    if (response.ok) {
      const events = await response.json();
      return events;
    }
  } catch (error) {
    console.error('Error fetching events from API:', error);
  }
  return null;
};

// Save events to API
const saveEventsToAPI = async (events) => {
  try {
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(events),
    });
    return response.ok;
  } catch (error) {
    console.error('Error saving events to API:', error);
    return false;
  }
};

// Load events from localStorage (fallback)
const loadEventsFromStorage = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    }
  } catch (error) {
    console.error('Error loading events from localStorage:', error);
  }
  return [];
};

// Save events to localStorage (fallback/cache)
const saveEventsToStorage = (events) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    }
  } catch (error) {
    console.error('Error saving events to localStorage:', error);
  }
};

export const EventsProvider = ({ children }) => {
  const [events, setEvents] = useState(() => loadEventsFromStorage());
  const [isLoading, setIsLoading] = useState(true);

  // Fetch events from API on mount
  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      const apiEvents = await fetchEventsFromAPI();
      if (apiEvents && apiEvents.length >= 0) {
        setEvents(apiEvents);
        saveEventsToStorage(apiEvents);
      } else {
        // Use cached events if API fails
        const cachedEvents = loadEventsFromStorage();
        if (cachedEvents.length > 0) {
          setEvents(cachedEvents);
        }
      }
      setIsLoading(false);
    };

    loadEvents();
  }, []);

  // Sync events periodically from API
  useEffect(() => {
    const syncInterval = setInterval(async () => {
      const apiEvents = await fetchEventsFromAPI();
      if (apiEvents && Array.isArray(apiEvents)) {
        setEvents(apiEvents);
        saveEventsToStorage(apiEvents);
      }
    }, SYNC_INTERVAL);

    return () => clearInterval(syncInterval);
  }, []);

  // Save to localStorage whenever events change (for offline cache)
  useEffect(() => {
    saveEventsToStorage(events);
  }, [events]);

  // Listen for storage events from other tabs (cross-tab sync)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY) {
        const updatedEvents = loadEventsFromStorage();
        setEvents(updatedEvents);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addEvent = async (eventData) => {
    const newEvent = {
      ...eventData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      isMultiDay: eventData.isMultiDay || false,
    };

    // Optimistically update UI
    setEvents((prevEvents) => [...prevEvents, newEvent]);

    // Save to API
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });

      if (!response.ok) {
        // Revert on error
        setEvents((prevEvents) => prevEvents.filter(e => e.id !== newEvent.id));
        throw new Error('Failed to save event');
      }
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    }

    return newEvent;
  };

  const updateEvent = async (eventId, updatedData) => {
    // Optimistically update UI
    setEvents((prevEvents) => {
      const updated = prevEvents.map((event) =>
        event.id === eventId ? { ...event, ...updatedData } : event
      );
      
      // Sync to API
      saveEventsToAPI(updated);
      
      return updated;
    });
  };

  const deleteEvent = async (eventId) => {
    // Optimistically update UI
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));

    // Delete from API
    try {
      const response = await fetch(API_URL, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId }),
      });

      if (!response.ok) {
        // Revert on error - reload from API
        const apiEvents = await fetchEventsFromAPI();
        if (apiEvents) {
          setEvents(apiEvents);
        }
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      // Revert on error
      const apiEvents = await fetchEventsFromAPI();
      if (apiEvents) {
        setEvents(apiEvents);
      }
    }
  };

  const clearAllEvents = async () => {
    setEvents([]);
    await saveEventsToAPI([]);
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
