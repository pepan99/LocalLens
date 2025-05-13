import { db } from "@/db";
import { eventAttendance } from "@/db/schemas/event-attendance";
import { events } from "@/db/schemas/events";
import { EventType, RSVPStatusEnum } from "@/modules/events/types/events";
import { count, desc, eq, isNull, sql } from "drizzle-orm";
import { mapEventsToEventTypes, mapEventToEventType } from "..";
import { getEventAttendeeCount } from "./rsvp";

/**
 * Get all public events (no auth required)
 */
export const getPublicEvents = async (): Promise<EventType[]> => {
  try {
    // Get only public events
    const results = await db
      .select({
        event: events,
        userAttendance: sql<null>`NULL`.as("userAttendance"),
        attendeeCount: sql<number>`(
          SELECT COUNT(*) FROM ${eventAttendance}
          WHERE ${eventAttendance.eventId} = ${events.id}
          AND ${eventAttendance.status} = ${RSVPStatusEnum.GOING}
        )`.as("attendeeCount"),
      })
      .from(events)
      .where(eq(events.isPrivate, false))
      .orderBy(desc(events.date));

    // Map the results to EventType objects
    return results.map(({ event, userAttendance, attendeeCount }) => {
      const mappedEvent = mapEventToEventType({ event, userAttendance });
      return {
        ...mappedEvent,
        attendees: attendeeCount || 0,
      };
    });
  } catch (error) {
    console.error("Error fetching public events:", error);
    return [];
  }
};

/**
 * Get a single public event by ID (no auth required)
 */
export const getPublicEventById = async (
  eventId: string,
): Promise<EventType | null> => {
  try {
    // Get the public event
    const results = await db
      .select({
        event: events,
        userAttendance: sql<null>`NULL`.as("userAttendance"),
      })
      .from(events)
      .where(sql`${events.id} = ${eventId} AND ${events.isPrivate} = 0`);

    if (results.length === 0) {
      return null;
    }

    const result = results[0];
    const mappedEvent = mapEventToEventType(result);

    // Get the attendee count
    const attendeeCount = await getEventAttendeeCount(eventId);

    return {
      ...mappedEvent,
      attendees: attendeeCount,
    };
  } catch (error) {
    console.error("Error fetching public event:", error);
    return null;
  }
};

/**
 * Get nearby public events based on location (no auth required)
 */
export const getNearbyPublicEvents = async (
  latitude: number,
  longitude: number,
  radiusInKm: number = 10,
  limit: number = 20,
): Promise<EventType[]> => {
  try {
    const latDelta = radiusInKm / 111;
    const lonDelta = radiusInKm / (111 * Math.cos(latitude * (Math.PI / 180)));

    // Only get public events
    const results = await db
      .select({
        event: events,
        userAttendance: sql<null>`NULL`.as("userAttendance"),
        attendeeCount: sql<number>`(
          SELECT COUNT(*) FROM ${eventAttendance}
          WHERE ${eventAttendance.eventId} = ${events.id}
          AND ${eventAttendance.status} = ${RSVPStatusEnum.GOING}
        )`.as("attendeeCount"),
      })
      .from(events)
      .where(
        sql`${events.latitude} BETWEEN ${latitude - latDelta} AND ${latitude + latDelta} AND
            ${events.longitude} BETWEEN ${longitude - lonDelta} AND ${longitude + lonDelta} AND
            ${events.isPrivate} = 0`,
      )
      .orderBy(desc(events.date))
      .limit(limit);

    // Map the results to EventType objects
    return results.map(({ event, userAttendance, attendeeCount }) => {
      const mappedEvent = mapEventToEventType({ event, userAttendance });
      return {
        ...mappedEvent,
        attendees: attendeeCount || 0,
      };
    });
  } catch (error) {
    console.error("Error fetching nearby public events:", error);
    return [];
  }
};

/**
 * Search for public events by title, location, or description (no auth required)
 */
export const searchPublicEvents = async (
  searchTerm: string,
  limit: number = 20,
): Promise<EventType[]> => {
  try {
    const searchPattern = `%${searchTerm}%`;

    // Only get public events
    const results = await db
      .select({
        event: events,
        userAttendance: sql<null>`NULL`.as("userAttendance"),
        attendeeCount: sql<number>`(
          SELECT COUNT(*) FROM ${eventAttendance}
          WHERE ${eventAttendance.eventId} = ${events.id}
          AND ${eventAttendance.status} = ${RSVPStatusEnum.GOING}
        )`.as("attendeeCount"),
      })
      .from(events)
      .where(
        sql`(
          ${events.title} LIKE ${searchPattern} OR
          ${events.location} LIKE ${searchPattern} OR
          ${events.description} LIKE ${searchPattern}
        ) AND ${events.isPrivate} = 0`,
      )
      .orderBy(desc(events.date))
      .limit(limit);

    // Map the results to EventType objects
    return results.map(({ event, userAttendance, attendeeCount }) => {
      const mappedEvent = mapEventToEventType({ event, userAttendance });
      return {
        ...mappedEvent,
        attendees: attendeeCount || 0,
      };
    });
  } catch (error) {
    console.error("Error searching public events:", error);
    return [];
  }
};

/**
 * Get public events by category (no auth required)
 */
export const getPublicEventsByCategory = async (
  category: string,
  limit: number = 20,
): Promise<EventType[]> => {
  try {
    // Only get public events in the specified category
    const results = await db
      .select({
        event: events,
        userAttendance: sql<null>`NULL`.as("userAttendance"),
        attendeeCount: sql<number>`(
          SELECT COUNT(*) FROM ${eventAttendance}
          WHERE ${eventAttendance.eventId} = ${events.id}
          AND ${eventAttendance.status} = ${RSVPStatusEnum.GOING}
        )`.as("attendeeCount"),
      })
      .from(events)
      .where(sql`${events.category} = ${category} AND ${events.isPrivate} = 0`)
      .orderBy(desc(events.date))
      .limit(limit);

    // Map the results to EventType objects
    return results.map(({ event, userAttendance, attendeeCount }) => {
      const mappedEvent = mapEventToEventType({ event, userAttendance });
      return {
        ...mappedEvent,
        attendees: attendeeCount || 0,
      };
    });
  } catch (error) {
    console.error("Error fetching public events by category:", error);
    return [];
  }
};
