"use server";

import { randomUUID } from "crypto";
import { auth } from "@/auth";
import { db } from "@/db";
import { eventAttendance } from "@/db/schemas/event-attendance";
import { eventInvitations } from "@/db/schemas/event-invitations";
import { events } from "@/db/schemas/events";
import { ActionResult } from "@/types/result";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  CreateEventFormValues,
  createEventSchema,
  rsvpFormSchema,
  RSVPFormValues,
} from "../schemas/schemas";
import { getEventById } from "../server/queries";

/**
 * Create a new event
 */
export const createEvent = async (
  formData: CreateEventFormValues,
): Promise<ActionResult> => {
  try {
    // Get the current user
    const session = await auth();
    if (!session?.user?.id) {
      return { type: "error", message: "Not authenticated" };
    }

    // Parse and validate the form data
    const parsedData = createEventSchema.safeParse(formData);

    if (!parsedData.success) {
      console.error("Validation error:", parsedData.error);
      return { type: "error", message: "Invalid event data" };
    }

    const eventData = parsedData.data;
    const { latitude = 0, longitude = 0, ...restEventData } = eventData;

    // Insert the event into the database
    await db.insert(events).values({
      ...restEventData,
      id: randomUUID(),
      latitude,
      longitude,
      creatorId: session.user.id,
    });

    // Revalidate the events page
    revalidatePath("/events");

    return {
      type: "success",
      message: "Event created successfully",
    };
  } catch (error) {
    console.error("Error creating event:", error);
    return { type: "error", message: "Failed to create event" };
  }
};

/**
 * Update an existing event
 */
export const updateEvent = async (
  eventId: string,
  formData: CreateEventFormValues,
): Promise<ActionResult> => {
  try {
    // Get the current user
    const session = await auth();
    if (!session?.user?.id) {
      return { type: "error", message: "Not authenticated" };
    }

    // Parse and validate the form data
    const parsedData = createEventSchema.safeParse(formData);

    if (!parsedData.success) {
      console.error("Validation error:", parsedData.error);
      return { type: "error", message: "Invalid event data" };
    }

    const eventData = parsedData.data;
    const { latitude = 0, longitude = 0, ...restEventData } = eventData;

    // Check if the event exists and is owned by the current user
    const [existingEvent] = await db
      .select()
      .from(events)
      .where(
        and(eq(events.id, eventId), eq(events.creatorId, session.user.id)),
      );

    if (!existingEvent) {
      return {
        type: "error",
        message: "Event not found or you don't have permission to edit it",
      };
    }

    // Update the event
    await db
      .update(events)
      .set({
        ...restEventData,
        latitude,
        longitude,
      })
      .where(eq(events.id, eventId));

    // Revalidate the events page and the specific event page
    revalidatePath("/events");
    revalidatePath(`/events/${eventId}`);

    return {
      type: "success",
      message: "Event updated successfully",
    };
  } catch (error) {
    console.error("Error updating event:", error);
    return { type: "error", message: "Failed to update event" };
  }
};
/**
 * Delete an event
 */
export const deleteEvent = async (eventId: string): Promise<ActionResult> => {
  try {
    // Get the current user
    const session = await auth();
    if (!session?.user?.id) {
      return { type: "error", message: "Not authenticated" };
    }

    // Check if the event exists and is owned by the current user
    const [existingEvent] = await db
      .select()
      .from(events)
      .where(
        and(eq(events.id, eventId), eq(events.creatorId, session.user.id)),
      );

    if (!existingEvent) {
      return {
        type: "error",
        message: "Event not found or you don't have permission to delete it",
      };
    }

    // Delete invitations and attendance records first (respecting foreign key constraints)
    await db
      .delete(eventInvitations)
      .where(eq(eventInvitations.eventId, eventId));
    await db
      .delete(eventAttendance)
      .where(eq(eventAttendance.eventId, eventId));

    // Delete the event
    await db.delete(events).where(eq(events.id, eventId));

    // Revalidate the events page
    revalidatePath("/events");

    return { type: "success", message: "Event deleted successfully" };
  } catch (error) {
    console.error("Error deleting event:", error);
    return { type: "error", message: "Failed to delete event" };
  }
};

/**
 * RSVP to an event (attend, maybe, not attend)
 */
export const respondToEvent = async (
  eventId: string,
  status: RSVPFormValues,
): Promise<ActionResult> => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { type: "error", message: "Not authenticated" };
    }
    const userId = session.user.id;

    // Validate input
    // Parse and validate the form data
    const parsedData = rsvpFormSchema.safeParse(status);

    if (!parsedData.success) {
      console.error("Validation error:", parsedData.error);
      return { type: "error", message: "Invalid event data" };
    }

    const rsvp = parsedData.data;

    // Check if the event exists and user has permission to view it
    const event = await getEventById(eventId);
    if (!event) {
      return {
        type: "error",
        message: "Event not found or you don't have permission to view it",
      };
    }

    // Check if there's an existing response
    const [existingResponse] = await db
      .select()
      .from(eventAttendance)
      .where(
        and(
          eq(eventAttendance.eventId, eventId),
          eq(eventAttendance.userId, userId),
        ),
      );

    if (existingResponse) {
      // Update existing response
      await db
        .update(eventAttendance)
        .set({ status: rsvp.status, guests: rsvp.guests, note: rsvp.note })
        .where(
          and(
            eq(eventAttendance.eventId, eventId),
            eq(eventAttendance.userId, userId),
          ),
        );
    } else {
      // Create new response
      await db.insert(eventAttendance).values({
        userId: session.user.id,
        eventId: eventId,
        status: rsvp.status,
        guests: rsvp.guests,
        note: rsvp.note,
      });
    }

    // Revalidate all relevant paths to ensure data is refreshed everywhere
    revalidatePath(`/events`);

    return {
      type: "success",
      message: "RSVP updated successfully",
    };
  } catch (error) {
    console.error("Error responding to event:", error);
    return { type: "error", message: "Failed to respond to event" };
  }
};

// /**
//  * Invite users to an event
//  */
// export const inviteToEvent = async (
//   eventId: string,
//   userIds: string[],
// ): Promise<{ success: boolean } | ActionError> => {
//   try {
//     const session = await auth();
//     if (!session?.user?.id) {
//       return { error: "Not authenticated" };
//     }

//     // Check if the event exists and is owned by the current user
//     const [existingEvent] = await db
//       .select()
//       .from(events)
//       .where(
//         and(eq(events.id, eventId), eq(events.creatorId, session.user.id)),
//       );

//     if (!existingEvent) {
//       return {
//         error: "Event not found or you don't have permission to invite users",
//       };
//     }

//     // Get existing invitations to avoid duplicates
//     const existingInvitations = await db
//       .select({ userId: eventInvitations.invitedUserId })
//       .from(eventInvitations)
//       .where(eq(eventInvitations.eventId, eventId));

//     const existingInvitedUserIds = existingInvitations.map(inv => inv.userId);

//     // Filter out users that have already been invited
//     const newUserIdsToInvite = userIds.filter(
//       id => !existingInvitedUserIds.includes(id),
//     );

//     if (newUserIdsToInvite.length === 0) {
//       return { success: true }; // All users already invited
//     }

//     // Create invitation records
//     await db.insert(eventInvitations).values(
//       newUserIdsToInvite.map(userId => ({
//         eventId,
//         invitedUserId: userId,
//       })),
//     );

//     // Revalidate the event page
//     revalidatePath(`/events/${eventId}`);

//     return { success: true };
//   } catch (error) {
//     console.error("Error inviting to event:", error);
//     return { error: "Failed to invite users to event" };
//   }
// };
