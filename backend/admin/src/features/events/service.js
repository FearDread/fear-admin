// features/events/service.js
import { ThunkFactory } from "@feardread/feature-factory";

export const EventService = {
  getUpcomingEvents: ThunkFactory.custom('event', 'upcoming', {
    method: 'GET',
  }),

  getEventsByDateRange: ThunkFactory.custom('event', 'date-range', {
    method: 'GET',
    useParams: true,
  }),

  getEventsByColor: ThunkFactory.custom('event', 'by-color', {
    method: 'GET',
    useParams: true,
  }),

  getTodaysEvents: ThunkFactory.custom('event', 'today', {
    method: 'GET',
  }),

  getThisWeeksEvents: ThunkFactory.custom('event', 'this-week', {
    method: 'GET',
  }),

  getRecurringEvents: ThunkFactory.custom('event', 'recurring', {
    method: 'GET',
  }),
  
  batchDelete: ThunkFactory.custom('event', 'batch-delete', {
    method: 'POST',
  }),
  
  batchUpdate: ThunkFactory.custom('event', 'batch-update', {
    method: 'PUT',
  }),
};

export default EventService;