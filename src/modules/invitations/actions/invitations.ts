"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { eventInvitations } from "@/db/schemas/event-invitations";
import { ActionResult } from "@/types/result";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const markInvitationsAsSeen = async (userId: string) => {
  await db
    .update(eventInvitations)
    .set({ seen: true })
    .where(eq(eventInvitations.invitedUserId, userId));
};

export const markEventInvitationAsDeleted = async (
  eventId: string,
): Promise<ActionResult> => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { type: "error", message: "Not authenticated" };
    }

    await db
      .update(eventInvitations)
      .set({ deleted: true })
      .where(
        and(
          eq(eventInvitations.eventId, eventId),
          eq(eventInvitations.invitedUserId, session.user.id),
        ),
      );

    revalidatePath("/notifications");

    return { type: "success", message: "Friend group created" };
  } catch (error) {
    console.error("Error creating friend group:", error);
    return { type: "error", message: "Failed to create friend group" };
  }
};

export const inviteUserToEvent = async ({
  eventId,
  invitedUserId,
}: {
  eventId: string;
  invitedUserId: string;
}) => {
  const existing = await db
    .select()
    .from(eventInvitations)
    .where(
      and(
        eq(eventInvitations.eventId, eventId),
        eq(eventInvitations.invitedUserId, invitedUserId),
      ),
    )
    .limit(1);

  if (existing.length > 0)
    return { success: false, message: "User already invited." };

  await db.insert(eventInvitations).values({
    eventId,
    invitedUserId,
  });

  return { success: true };
};

export const inviteGroupToEvent = async ({
  eventId,
  groupMemberIds,
}: {
  eventId: string;
  groupMemberIds: string[];
}) => {
  const session = await auth();

  if (!session?.user?.id) {
    return { type: "error", message: "Not authenticated" };
  }

  const invitedIds = groupMemberIds.filter(id => id !== session.user.id);

  const values = invitedIds.map(userId => ({
    eventId,
    invitedUserId: userId,
  }));

  await db.insert(eventInvitations).values(values);
  return { success: true, invitedCount: values.length };
};
