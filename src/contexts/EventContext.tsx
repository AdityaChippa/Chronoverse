'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SpaceEvent, FilterOptions } from '@/types';
import { fetchEvents, fetchAPOD } from '@/services/nasa';
import { getHistoricalEvents } from '@/lib/api/astronomyData';

interface EventContextType {
  events: SpaceEvent[];
  todayEvents: SpaceEvent[];
  loading: boolean;
  error: string | null;
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  searchEvents: (query: string) => void;
  getEventsByDate: (date: Date) => SpaceEvent[];
  refreshEvents: () => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<SpaceEvent[]>([]);
  const [todayEvents, setTodayEvents] = useState<SpaceEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    // Get historical events for today
    const loadTodayEvents = async () => {
      const today = new Date();
      const historicalEvents = await getHistoricalEvents(today);
      setTodayEvents(historicalEvents);
    };
    loadTodayEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch regular events
      const fetchedEvents = await fetchEvents();
      
      // Also get historical events for various dates
      const dates = [
        new Date(), // Today
        new Date('1969-07-20'), // Moon landing
        new Date('1961-04-12'), // First human in space
        new Date('1957-10-04'), // Sputnik
      ];
      
      const historicalPromises = dates.map(date => getHistoricalEvents(date));
      const historicalResults = await Promise.all(historicalPromises);
      const allHistoricalEvents = historicalResults.flat();
      
      // Combine all events
      const allEvents = [...fetchedEvents, ...allHistoricalEvents];
      
      // Remove duplicates based on title and date
      const uniqueEvents = allEvents.filter((event, index, self) =>
        index === self.findIndex((e) => (
          e.title === event.title && 
          e.date.toDateString() === event.date.toDateString()
        ))
      );
      
      setEvents(uniqueEvents);
    } catch (err) {
      setError('Failed to load events');
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchEvents = (query: string) => {
    setFilters({ ...filters, searchQuery: query });
  };

  const getEventsByDate = (date: Date): SpaceEvent[] => {
    // Get all events that happened on this day (any year)
    const targetMonth = date.getMonth();
    const targetDay = date.getDate();
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getMonth() === targetMonth && 
             eventDate.getDate() === targetDay;
    }).sort((a, b) => new Date(a.date).getFullYear() - new Date(b.date).getFullYear());
  };

  const refreshEvents = async () => {
    await loadEvents();
  };

  const filteredEvents = events.filter(event => {
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      if (!event.title.toLowerCase().includes(query) &&
          !event.description.toLowerCase().includes(query)) {
        return false;
      }
    }

    if (filters.eventTypes && filters.eventTypes.length > 0) {
      if (!filters.eventTypes.includes(event.type)) {
        return false;
      }
    }

    if (filters.categories && filters.categories.length > 0) {
      if (!filters.categories.includes(event.category)) {
        return false;
      }
    }

    if (filters.agencies && filters.agencies.length > 0) {
      if (!event.agency || !filters.agencies.includes(event.agency)) {
        return false;
      }
    }

    if (filters.dateRange) {
      const eventDate = new Date(event.date);
      if (eventDate < filters.dateRange.start || eventDate > filters.dateRange.end) {
        return false;
      }
    }

    if (filters.significance !== undefined) {
      if (event.significance < filters.significance) {
        return false;
      }
    }

    return true;
  });

  return (
    <EventContext.Provider value={{
      events: filteredEvents,
      todayEvents,
      loading,
      error,
      filters,
      setFilters,
      searchEvents,
      getEventsByDate,
      refreshEvents
    }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEventContext() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext must be used within EventProvider');
  }
  return context;
}