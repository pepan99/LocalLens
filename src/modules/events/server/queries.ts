import { auth } from "@/auth";
import { db } from "@/db";
import { eventAttendance } from "@/db/schemas/event-attendance";
import { events } from "@/db/schemas/events";
import { EventType } from "@/modules/events/types/events";
import { and, count, desc, eq, isNull, sql } from "drizzle-orm";
import { mapEventsToEventTypes, mapEventToEventType } from "..";

/**
 * Get all events (public or created by the user)
 */
export const getEvents = async (): Promise<EventType[]> => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    // Get events
    // Start with a base query
    const baseQuery = db
      .select({
        event: events,
        userAttendance: eventAttendance,
      })
      .from(events)
      .leftJoin(
        eventAttendance,
        and(
          eq(events.id, eventAttendance.eventId),
          userId
            ? eq(eventAttendance.userId, userId)
            : isNull(eventAttendance.userId),
        ),
      );

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
    const finalQuery = filteredQuery.orderBy(desc(events.date));

    const results = await finalQuery;

    return mapEventsToEventTypes(results);
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

    const userId = session.user.id;

    // Get events created by the user with their attendance status
    const results = await db
      .select({
        event: events,
        userAttendance: eventAttendance,
      })
      .from(events)
      .leftJoin(
        eventAttendance,
        and(
          eq(events.id, eventAttendance.eventId),
          eq(eventAttendance.userId, userId),
        ),
      )
      .where(eq(events.creatorId, userId))
      .orderBy(desc(events.date));

    return mapEventsToEventTypes(results);
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

    // Get the event with attendance status if user is logged in
    const query = db
      .select({
        event: events,
        userAttendance: userId
          ? eventAttendance
          : sql<null>`NULL`.as("userAttendance"),
      })
      .from(events);

    // Add left join for attendance if user is logged in
    let asdf;
    if (userId) {
      asdf = query.leftJoin(
        eventAttendance,
        and(
          eq(events.id, eventAttendance.eventId),
          eq(eventAttendance.userId, userId),
        ),
      );
    }

    // Apply where clause
    const results = await (asdf ?? query).where(eq(events.id, eventId));

    if (results.length === 0) {
      return null;
    }

    const result = results[0];

    return mapEventToEventType(result);
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

    const latDelta = radiusInKm / 111;
    const lonDelta = radiusInKm / (111 * Math.cos(latitude * (Math.PI / 180)));

    // Build query with attendance data if user is logged in
    const query = db
      .select({
        event: events,
        userAttendance: userId
          ? eventAttendance
          : sql<null>`NULL`.as("userAttendance"),
      })
      .from(events);

    // Add left join for attendance if user is logged in
    let asdf;
    if (userId) {
      asdf = query.leftJoin(
        eventAttendance,
        and(
          eq(events.id, eventAttendance.eventId),
          eq(eventAttendance.userId, userId),
        ),
      );
    }
    asdf ??= query;

    // Apply location and permission filters
    let filteredQuery;
    if (userId) {
      filteredQuery = asdf.where(
        and(
          sql`${events.latitude} BETWEEN ${latitude - latDelta} AND ${latitude + latDelta}`,
          sql`${events.longitude} BETWEEN ${longitude - lonDelta} AND ${longitude + lonDelta}`,
          sql`${events.isPrivate} = 0 OR ${events.creatorId} = ${userId}`,
        ),
      );
    } else {
      // If not logged in, only include public events
      filteredQuery = asdf.where(
        and(
          sql`${events.latitude} BETWEEN ${latitude - latDelta} AND ${latitude + latDelta}`,
          sql`${events.longitude} BETWEEN ${longitude - lonDelta} AND ${longitude + lonDelta}`,
          eq(events.isPrivate, false),
        ),
      );
    }

    const results = await filteredQuery.orderBy(desc(events.date)).limit(limit);

    return mapEventsToEventTypes(results);
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

    // Build query with attendance data if user is logged in
    const query = db
      .select({
        event: events,
        userAttendance: userId
          ? eventAttendance
          : sql<null>`NULL`.as("userAttendance"),
      })
      .from(events);

    // Add left join for attendance if user is logged in
    let asdf;
    if (userId) {
      asdf = query.leftJoin(
        eventAttendance,
        and(
          eq(events.id, eventAttendance.eventId),
          eq(eventAttendance.userId, userId),
        ),
      );
    }
    asdf ??= query;

    // Apply search and permission filters
    let filteredQuery;
    if (userId) {
      filteredQuery = asdf.where(
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
      filteredQuery = asdf.where(
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

    const results = await filteredQuery.orderBy(desc(events.date)).limit(limit);

    return mapEventsToEventTypes(results);
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
/**
 * Get all events the user is attending
 */
export const getAttendingEvents = async (
  limit: number = 20,
  page: number = 1,
): Promise<EventType[]> => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return [];
    }

    // Get events the user is attending
    const results = await db
      .select({
        event: events,
        userAttendance: eventAttendance,
      })
      .from(events)
      .innerJoin(
        eventAttendance,
        and(
          eq(events.id, eventAttendance.eventId),
          eq(eventAttendance.userId, userId),
          eq(eventAttendance.status, "going"),
        ),
      )
      .orderBy(desc(events.date))
      .limit(limit)
      .offset((page - 1) * limit);

    return mapEventsToEventTypes(results);
  } catch (error) {
    console.error("Error fetching attending events:", error);
    return [];
  }
};
