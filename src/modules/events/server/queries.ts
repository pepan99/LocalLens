import { auth } from "@/auth";
import { db } from "@/db";
import { events } from "@/db/schemas/events";
import { eventAttendance } from "@/db/schemas/schema";
import { EventType } from "@/modules/events/types/events";
import { and, count, desc, eq, sql } from "drizzle-orm";
import { mapEventsToEventTypes, mapEventToEventType } from "..";

/**
 * Get all events (public or created by the user)
 */
export const getEvents = async (
  limit: number = 10,
  page: number = 1,
): Promise<EventType[]> => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    // Start with a base query
    const baseQuery = db.select().from(events);

    // Apply filter conditions based on user authentication
    let filteredQuery;
    if (userId) {
      // If user is logged in, include both public events and their private events
      filteredQuery = baseQuery.where(
        sql`${events.isPrivate} = 0 OR ${events.creatorId} = ${userId}`,
      );
    } else {
      // If not logged in, only include public events
      filteredQuery = baseQuery.where(eq(events.isPrivate, false));
    }

    // Apply ordering and pagination
    const finalQuery = filteredQuery
      .orderBy(desc(events.date))
      .limit(limit)
      .offset((page - 1) * limit);

    return mapEventsToEventTypes(await finalQuery);
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

/**
 * Get events created by the current user
 */
export const getUserEvents = async (): Promise<EventType[]> => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return [];
    }

    return mapEventsToEventTypes(
      await db
        .select()
        .from(events)
        .where(eq(events.creatorId, session.user.id))
        .orderBy(desc(events.date)),
    );
  } catch (error) {
    console.error("Error fetching user events:", error);
    return [];
  }
};

/**
 * Get a single event by ID
 */
export const getEventById = async (
  eventId: string,
): Promise<EventType | null> => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const [event] = await db
      .select()
      .from(events)
      .where(eq(events.id, eventId));

    if (!event) {
      return null;
    }

    // Check if the user has permission to view this event
    if (event.isPrivate && event.creatorId !== userId) {
      return null;
    }

    if (event !== null) {
      return mapEventToEventType(event);
    }
    return null;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
};

/**
 * Get nearby events based on user location
 */
export const getNearbyEvents = async (
  latitude: number,
  longitude: number,
  radiusInKm: number = 10,
  limit: number = 20,
): Promise<EventType[]> => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    // This is a simplified approach. For production, you'd want a more sophisticated
    // geospatial query, possibly using a spatial index or external service.
    // Here we're using a basic bounding box approach.

    // Convert radius to approximate latitude/longitude degrees
    // This is a rough approximation as 1 degree of latitude is ~111km
    const latDelta = radiusInKm / 111;
    const lonDelta = radiusInKm / (111 * Math.cos(latitude * (Math.PI / 180)));

    const query = db.select().from(events);
    // If user is logged in, include both public events and their private events

    let filteredQuery;
    if (userId) {
      filteredQuery = query.where(
        and(
          sql`${events.latitude} BETWEEN ${latitude - latDelta} AND ${latitude + latDelta}`,
          sql`${events.longitude} BETWEEN ${longitude - lonDelta} AND ${longitude + lonDelta}`,
          sql`${events.isPrivate} = 0 OR ${events.creatorId} = ${userId}`,
        ),
      );
    } else {
      // If not logged in, only include public events
      filteredQuery = query.where(
        and(
          sql`${events.latitude} BETWEEN ${latitude - latDelta} AND ${latitude + latDelta}`,
          sql`${events.longitude} BETWEEN ${longitude - lonDelta} AND ${longitude + lonDelta}`,
          eq(events.isPrivate, false),
        ),
      );
    }

    const finalQuery = filteredQuery.orderBy(desc(events.date)).limit(limit);

    return mapEventsToEventTypes(await finalQuery);
  } catch (error) {
    console.error("Error fetching nearby events:", error);
    return [];
  }
};

/**
 * Search for events by title, location, or description
 */
export const searchEvents = async (
  searchTerm: string,
  limit: number = 20,
): Promise<EventType[]> => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    // Note: SQLite's LIKE is case insensitive by default
    const searchPattern = `%${searchTerm}%`;

    const query = db.select().from(events);

    // If user is logged in, include both public events and their private events
    let filteredQuery;
    if (userId) {
      filteredQuery = query.where(
        and(
          sql`(
            ${events.title} LIKE ${searchPattern} OR
            ${events.location} LIKE ${searchPattern} OR
            ${events.description} LIKE ${searchPattern}
			)`,
          sql`${events.isPrivate} = 0 OR ${events.creatorId} = ${userId}`,
        ),
      );
    } else {
      // If not logged in, only include public events
      filteredQuery = query.where(
        and(
          sql`(
            ${events.title} LIKE ${searchPattern} OR
            ${events.location} LIKE ${searchPattern} OR
            ${events.description} LIKE ${searchPattern}
			)`,
          eq(events.isPrivate, false),
        ),
      );
    }

    const finalQuery = filteredQuery.orderBy(desc(events.date)).limit(limit);

    return mapEventsToEventTypes(await finalQuery);
  } catch (error) {
    console.error("Error searching events:", error);
    return [];
  }
};

export const getUserEventStats = async (userId: string) => {
  const [createdEventsResult] = await db
    .select({ count: count() })
    .from(events)
    .where(eq(events.creatorId, userId));

  const [attendedEventsResult] = await db
    .select({ count: count() })
    .from(eventAttendance)
    .where(eq(eventAttendance.userId, userId));

  return {
    createdEvents: createdEventsResult.count,
    attendedEvents: attendedEventsResult.count,
  };
};
