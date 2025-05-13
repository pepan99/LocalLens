import { eventAttendance } from "@/db/schemas/event-attendance";
import { events } from "@/db/schemas/events";
import { InferSelectModel } from "drizzle-orm";
import { EventType, RSVPStatusEnum } from "./types/events";

export const mapEventToEventType = ({
  event,
  userAttendance,
}: {
  event: InferSelectModel<typeof events>;
  userAttendance: InferSelectModel<typeof eventAttendance> | null;
}): EventType => {
  return {
    id: event.id,
    creatorId: event.creatorId,
    title: event.title,
    time: event.time,
    category: event.category,
    date: new Date(event.date),
    location: event.location || "",
    description: event.description,
    capacity: event.capacity,
    isPrivate: Boolean(event.isPrivate),
    latitude: event.latitude,
    longitude: event.longitude,
    // These fields don't exist in the original schema, so default values are assigned
    attendees: 0, // You may want to calculate this from a related table
    rating: 0, // You may want to calculate this from a related table
    imageUrl: event.imageUrl || null,
    rsvp: userAttendance
      ? {
          note: userAttendance.note,
          guests: userAttendance.guests,
          status: userAttendance.status as RSVPStatusEnum,
        }
      : null,
  };
};

// Helper function to map multiple events
export const mapEventsToEventTypes = (
  eventArray: {
    event: InferSelectModel<typeof events>;
    userAttendance: InferSelectModel<typeof eventAttendance> | null;
  }[],
): EventType[] => {
  return eventArray.map(mapEventToEventType);
};
