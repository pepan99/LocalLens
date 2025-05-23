import { auth } from "@/auth";
import { db } from "@/db";
import { eventAttendance } from "@/db/schemas/event-attendance";
import { users } from "@/db/schemas/users";
import { and, count, eq } from "drizzle-orm";
import { AttendingUser, RSVPStatusEnum } from "../types/events";

/**
 * Get all users attending an event
 */
export const getAttendingUsers = async (
  eventId: string,
): Promise<AttendingUser[]> => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return [];
    }

    // Get events the user is attending
    const results = await db
      .select({
        userAttendance: eventAttendance,
        user: users,
      })
      .from(eventAttendance)
      .innerJoin(users, eq(users.id, eventAttendance.userId))
      .where(eq(eventAttendance.eventId, eventId))
      .orderBy(users.name);

    return results.map(({ user, userAttendance }) => ({
      id: user.id,
      name: user.name ?? "Unknown",
      image: user.image,
      rsvp: {
        status: userAttendance.status as RSVPStatusEnum,
        guests: userAttendance.guests,
        note: userAttendance.note,
      },
    }));
  } catch (error) {
    console.error("Error fetching attending events:", error);
    return [];
  }
};

/**
 * Get the number of attendees for an event (public function)
 */
export const getEventAttendeeCount = async (
  eventId: string,
): Promise<number> => {
  try {
    const results = await db
      .select({
        attendeeCount: count(),
      })
      .from(eventAttendance)
      .where(
        and(
          eq(eventAttendance.eventId, eventId),
          eq(eventAttendance.status, RSVPStatusEnum.GOING),
        ),
      );

    return results[0]?.attendeeCount || 0;
  } catch (error) {
    console.error("Error fetching attendee count:", error);
    return 0;
  }
};
