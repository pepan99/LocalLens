import { EventInvitationNotification } from "@/components/notifications/utils";
import { db } from "@/db";
import { eventInvitations } from "@/db/schemas/event-invitations";
import { events } from "@/db/schemas/events";
import { and, eq, not } from "drizzle-orm";
import { mapToEventInvitationNotification, RawEventInvitation } from "..";

export const getUserEventInvitations = async (
  userId: string,
): Promise<EventInvitationNotification[]> => {
  const rawInvitations: RawEventInvitation[] = await db
    .select({
      id: events.id,
      title: events.title,
      date: events.date,
      location: events.location,
      description: events.description,
      attendees: events.capacity,
      seen: eventInvitations.seen,
    })
    .from(eventInvitations)
    .innerJoin(events, eq(eventInvitations.eventId, events.id))
    .where(
      and(
        eq(eventInvitations.invitedUserId, userId),
        not(eq(eventInvitations.deleted, true)),
      ),
    );

  return rawInvitations.map(mapToEventInvitationNotification);
};

export const hasUnseenEventInvitations = async (
  userId: string,
): Promise<boolean> => {
  const result = await db
    .select({ seen: eventInvitations.seen })
    .from(eventInvitations)
    .where(
      and(
        eq(eventInvitations.invitedUserId, userId),
        not(eq(eventInvitations.seen, true)),
        not(eq(eventInvitations.deleted, true)),
      ),
    )
    .limit(1);

  return result.length > 0;
};
