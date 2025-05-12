import { db } from "@/db";
import { eventAttendance } from "@/db/schemas/event-attendance";
import { events } from "@/db/schemas/events";
import { count, eq } from "drizzle-orm";

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
