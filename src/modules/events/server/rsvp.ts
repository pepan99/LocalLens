import { auth } from "@/auth";
import { db } from "@/db";
import { eventAttendance } from "@/db/schemas/event-attendance";
import { users } from "@/db/schemas/users";
import { and, eq } from "drizzle-orm";
import { AttendingUser, RSVPStatusEnum } from "../types/events";

/**
 * Get all users attending an event
 */
export const getAttendingEvents = async (): Promise<AttendingUser[]> => {
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
      .innerJoin(
        users,
        and(
          eq(users.id, eventAttendance.userId),
          eq(eventAttendance.userId, userId),
        ),
      );

    return results.map(({ user, userAttendance }) => ({
      id: user.id,
      name: user.name ?? "Unknown",
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
