"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { friendGroupMembers } from "@/db/schemas/friend-group-members";
import { friendGroups } from "@/db/schemas/friend-groups";
import { ActionResult } from "@/types/result";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const createFriendGroup = async (
  name: string,
  friendIds: string[],
): Promise<ActionResult> => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { type: "error", message: "Not authenticated" };
    }

    const [existing] = await db
      .select()
      .from(friendGroups)
      .where(eq(friendGroups.name, name));

    if (existing) {
      return { type: "error", message: "Group with this name already exists" };
    }

    const newGroup = await db
      .insert(friendGroups)
      .values({
        name,
        ownerId: session.user.id,
      })
      .returning();

    const newGroupId = newGroup[0].id;

    const membersToInsert = [
      { groupId: newGroupId, userId: session.user.id },
      ...friendIds.map(friendId => ({
        groupId: newGroupId,
        userId: friendId,
      })),
    ];

    await db.insert(friendGroupMembers).values(membersToInsert);

    revalidatePath("/friends");

    return { type: "success", message: "Friend group created" };
  } catch (error) {
    console.error("Error creating friend group:", error);
    return { type: "error", message: "Failed to create friend group" };
  }
};

export const deleteFriendGroup = async (
  groupId: string,
): Promise<ActionResult> => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { type: "error", message: "Not authenticated" };
    }

    const [group] = await db
      .select()
      .from(friendGroups)
      .where(eq(friendGroups.id, groupId));

    if (!group || group.ownerId !== session.user.id) {
      return { type: "error", message: "Not authorized to delete this group" };
    }

    await db.transaction(async tx => {
      await tx
        .delete(friendGroupMembers)
        .where(eq(friendGroupMembers.groupId, groupId));
      await tx.delete(friendGroups).where(eq(friendGroups.id, groupId));
    });

    revalidatePath("/friends");

    return { type: "success", message: "Group deleted" };
  } catch (error) {
    console.error("Error deleting group:", error);
    return { type: "error", message: "Failed to delete group" };
  }
};

export const renameGroup = async (groupId: string, newName: string) => {
  await db
    .update(friendGroups)
    .set({ name: newName })
    .where(eq(friendGroups.id, groupId));
};

export const removeMemberFromGroup = async (
  groupId: string,
  memberId: string,
) => {
  await db
    .delete(friendGroupMembers)
    .where(
      and(
        eq(friendGroupMembers.groupId, groupId),
        eq(friendGroupMembers.userId, memberId),
      ),
    );
};

export const addMembersToGroup = async (
  groupId: string,
  memberIds: string[],
) => {
  const values = memberIds.map(userId => ({
    groupId,
    userId,
  }));

  await db.insert(friendGroupMembers).values(values);
};

// Curentlly not used methods
export const joinFriendGroup = async (
  groupId: string,
): Promise<ActionResult> => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { type: "error", message: "Not authenticated" };
    }

    const [exists] = await db
      .select()
      .from(friendGroupMembers)
      .where(
        and(
          eq(friendGroupMembers.groupId, groupId),
          eq(friendGroupMembers.userId, session.user.id),
        ),
      );

    if (exists) {
      return { type: "error", message: "Already in this group" };
    }

    await db.insert(friendGroupMembers).values({
      groupId,
      userId: session.user.id,
    });

    revalidatePath("/friends");

    return { type: "success", message: "Joined group" };
  } catch (error) {
    console.error("Error joining group:", error);
    return { type: "error", message: "Failed to join group" };
  }
};

export const leaveFriendGroup = async (
  groupId: string,
): Promise<ActionResult> => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { type: "error", message: "Not authenticated" };
    }

    await db
      .delete(friendGroupMembers)
      .where(
        and(
          eq(friendGroupMembers.groupId, groupId),
          eq(friendGroupMembers.userId, session.user.id),
        ),
      );

    revalidatePath("/friends");

    return { type: "success", message: "Left group" };
  } catch (error) {
    console.error("Error leaving group:", error);
    return { type: "error", message: "Failed to leave group" };
  }
};
