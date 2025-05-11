import { events } from "@/db/schemas/events";
import { InferSelectModel } from "drizzle-orm";
import { EventType } from "./types/events";

export const mapEventToEventType = (
  event: InferSelectModel<typeof events>,
): EventType => {
  return {
    id: event.id,
    creatorId: event.creatorId,
    title: event.title,
    time: event.time,
    category: event.category,
    date: new Date(event.date).toISOString(),
    location: event.location || "",
    description: event.description,
    capacity: event.capacity,
    isEventPrivate: Boolean(event.isPrivate),
    coordinates: [event.longitude, event.latitude],
    // These fields don't exist in the original schema, so default values are assigned
    attendees: 0, // You may want to calculate this from a related table
    rating: 0, // You may want to calculate this from a related table
  };
};

// Helper function to map multiple events
export const mapEventsToEventTypes = (
  eventArray: InferSelectModel<typeof events>[],
): EventType[] => {
  return eventArray.map(mapEventToEventType);
};
