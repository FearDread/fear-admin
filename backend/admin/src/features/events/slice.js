// features/events/slice.js
import { FeatureFactory } from '@feardread/feature-factory';
import EventService from './service';

const eventReducers = {
  setCurrentEvent: (state, action) => {
    state.currentEvent = action.payload;
  },
  
  clearCurrentEvent: (state) => {
    state.currentEvent = null;
  },
  
  updateCurrentEvent: (state, action) => {
    state.currentEvent = {
      ...state.currentEvent,
      ...action.payload,
    };
  },
  
  setEventFilters: (state, action) => {
    state.filters = { ...state.filters, ...action.payload };
  },
  
  clearEventFilters: (state) => {
    state.filters = {
      color: null,
      dateFrom: null,
      dateTo: null,
      searchTerm: '',
    };
  },
  
  setEventStats: (state, action) => {
    state.statistics = action.payload;
  },
  
  addEventNote: (state, action) => {
    const { eventId, note } = action.payload;
    const event = state.entities[eventId];
    
    if (event) {
      if (!event.notes) {
        event.notes = [];
      }
      event.notes.push({
        id: Date.now().toString(),
        text: note,
        createdAt: new Date().toISOString(),
      });
    }
  },
  
  setUpcomingEvents: (state, action) => {
    state.upcomingEvents = action.payload;
  },
  
  updateEventColor: (state, action) => {
    const { eventId, color } = action.payload;
    const event = state.entities[eventId];
    
    if (event) {
      event.color = color;
      event.updatedAt = new Date().toISOString();
    }
    
    if (state.currentEvent?.id === eventId) {
      state.currentEvent.color = color;
      state.currentEvent.updatedAt = new Date().toISOString();
    }
  },
};

const eventFactory = FeatureFactory('event', eventReducers);

export const { slice, asyncActions: Event } = eventFactory.create({
  service: EventService,
  stateOptions: {
    includeEntityState: true,
    includeMetadata: true,
    customFields: {
      currentEvent: null,
      upcomingEvents: [],
      filters: {
        color: null,
        dateFrom: null,
        dateTo: null,
        searchTerm: '',
      },
      statistics: {
        totalEvents: 0,
        thisMonth: 0,
        thisWeek: 0,
        upcoming: 0,
        past: 0,
        byColor: {},
      },
    },
  },
  includeCommonReducers: true,
});

export const {
  setData,
  setLoading,
  setSuccess,
  setError,
  clearError,
  resetState,
  updateMetadata,
  setCurrentEvent,
  clearCurrentEvent,
  updateCurrentEvent,
  setEventFilters,
  clearEventFilters,
  setEventStats,
  addEventNote,
  setUpcomingEvents,
  updateEventColor,
} = slice.actions;

export const {
  fetch: fetchEvents,
  fetchOne: fetchEvent,
  search: searchEvents,
  //create: createEvent,
  update: updateEvent,
  patch: patchEvent,
  delete: deleteEvent,
  customCreateEvent: createEvent
} = Event;

export const fetchUpcomingEvents = (limit = 10) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    const now = new Date().toISOString();
    const result = await dispatch(
      fetchEvents({ 
        filter: `start>${now}`,
        sort: 'start',
        limit 
      })
    );
    
    if (fetchEvents.fulfilled.match(result)) {
      const upcomingEvents = result.payload.data || [];
      dispatch(setUpcomingEvents(upcomingEvents));
      return { success: true, events: upcomingEvents };
    } else {
      throw new Error(result.error?.message || 'Failed to fetch upcoming events');
    }
  } catch (error) {
    dispatch(setError(error.message));
    return { success: false, error: error.message };
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchEventsByDateRange = (startDate, endDate) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    const result = await dispatch(
      fetchEvents({
        filter: `start>=${startDate}&end<=${endDate}`,
        sort: 'start'
      })
    );
    
    if (fetchEvents.fulfilled.match(result)) {
      return { success: true, events: result.payload.data };
    } else {
      throw new Error(result.error?.message || 'Failed to fetch events');
    }
  } catch (error) {
    dispatch(setError(error.message));
    return { success: false, error: error.message };
  } finally {
    dispatch(setLoading(false));
  }
};

export const calculateEventStatistics = () => (dispatch, getState) => {
  const state = getState();
  const events = selectAllEvents(state);
  
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  
  const statistics = {
    totalEvents: events.length,
    thisMonth: events.filter(e => new Date(e.start) >= startOfMonth).length,
    thisWeek: events.filter(e => new Date(e.start) >= startOfWeek).length,
    upcoming: events.filter(e => new Date(e.start) > now).length,
    past: events.filter(e => new Date(e.end) < now).length,
    byColor: events.reduce((acc, event) => {
      const color = event.color || 'default';
      acc[color] = (acc[color] || 0) + 1;
      return acc;
    }, {}),
  };
  
  dispatch(setEventStats(statistics));
  return statistics;
};

export const batchDeleteEvents = (eventIds) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    const deletePromises = eventIds.map(id => 
      dispatch(deleteEvent(id)).unwrap()
    );
    
    await Promise.all(deletePromises);
    
    // Refresh events
    await dispatch(fetchEvents());
    
    return { success: true, deletedCount: eventIds.length };
  } catch (error) {
    dispatch(setError(error.message));
    return { success: false, error: error.message };
  } finally {
    dispatch(setLoading(false));
  }
};

export const duplicateEvent = (eventId, newStartDate) => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    const state = getState();
    const event = selectEventById(state, eventId);
    
    if (!event) {
      throw new Error('Event not found');
    }
    
    const originalStart = new Date(event.start);
    const originalEnd = new Date(event.end);
    const duration = originalEnd - originalStart;
    
    const newStart = new Date(newStartDate);
    const newEnd = new Date(newStart.getTime() + duration);
    
    const duplicatedEvent = {
      ...event,
      id: undefined,
      _id: undefined,
      title: `${event.title} (Copy)`,
      start: newStart.toISOString(),
      end: newEnd.toISOString(),
      createdAt: new Date().toISOString(),
    };
    
    const result = await dispatch(createEvent(duplicatedEvent)).unwrap();
    
    return { success: true, event: result };
  } catch (error) {
    dispatch(setError(error.message));
    return { success: false, error: error.message };
  } finally {
    dispatch(setLoading(false));
  }
};

// Export selectors
export const selectAllEvents = (state) => state.events.data || [];
export const selectCurrentEvent = (state) => state.events.currentEvent;
export const selectUpcomingEvents = (state) => state.events.upcomingEvents;
export const selectEventById = (state, eventId) => 
  state.events.entities?.[eventId] || 
  state.events.data?.find(e => e.id === eventId || e._id === eventId);
export const selectLoading = (state) => state.events.loading;
export const selectError = (state) => state.events.error;
export const selectSuccess = (state) => state.events.success;
export const selectEventFilters = (state) => state.events.filters;
export const selectEventStatistics = (state) => state.events.statistics;

/**
 * Select events by color
 */
export const selectEventsByColor = (state, color) => {
  return selectAllEvents(state).filter(event => event.color === color);
};

export const selectEventsByDateRange = (state, startDate, endDate) => {
  const events = selectAllEvents(state);
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return events.filter(event => {
    const eventStart = new Date(event.start);
    return eventStart >= start && eventStart <= end;
  });
};

export const selectTodaysEvents = (state) => {
  const events = selectAllEvents(state);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return events.filter(event => {
    const eventStart = new Date(event.start);
    return eventStart >= today && eventStart < tomorrow;
  });
};

export const selectThisWeeksEvents = (state) => {
  const events = selectAllEvents(state);
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);
  
  return events.filter(event => {
    const eventStart = new Date(event.start);
    return eventStart >= startOfWeek && eventStart < endOfWeek;
  });
};

export const selectFilteredEvents = (state) => {
  let events = selectAllEvents(state);
  const filters = state.events.filters;
  
  if (filters.color) {
    events = events.filter(e => e.color === filters.color);
  }
  
  if (filters.dateFrom) {
    const fromDate = new Date(filters.dateFrom);
    events = events.filter(e => new Date(e.start) >= fromDate);
  }
  
  if (filters.dateTo) {
    const toDate = new Date(filters.dateTo);
    events = events.filter(e => new Date(e.end) <= toDate);
  }
  
  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    events = events.filter(e => 
      e.title?.toLowerCase().includes(term) ||
      e.description?.toLowerCase().includes(term)
    );
  }
  
  return events;
};

export default slice;