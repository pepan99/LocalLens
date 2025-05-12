"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { friendRequests } from "@/db/schemas/friend-requests";
import { friends } from "@/db/schemas/friends";
import { users } from "@/db/schemas/users";
import { ActionResult } from "@/types/result";
import { and, eq, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const acceptFriendRequest = async (
  requestId: string,
): Promise<ActionResult> => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { type: "error", message: "Not authenticated" };
    }

    const [request] = await db
      .select()
      .from(friendRequests)
      .where(eq(friendRequests.id, requestId));

    if (!request || request.toUserId !== session.user.id) {
      return {
        type: "error",
        message: "Friend request not found or unauthorized",
      };
    }

    if (request.status !== "pending") {
      return {
        type: "error",
        message: "This request has already been handled",
      };
    }

    await db.transaction(async tx => {
      await tx.insert(friends).values([
        { userId: request.fromUserId, friendId: request.toUserId },
        { userId: request.toUserId, friendId: request.fromUserId },
      ]);

      await tx
        .update(friendRequests)
        .set({ status: "accepted" })
        .where(eq(friendRequests.id, requestId));
    });

    revalidatePath("/friends");

    return { type: "success", message: "Friend request accepted" };
  } catch (error) {
    console.error("Error accepting friend request:", error);
    return { type: "error", message: "Failed to accept request" };
  }
};

export const rejectFriendRequest = async (
  requestId: string,
): Promise<ActionResult> => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { type: "error", message: "Not authenticated" };
    }

    const [request] = await db
      .select()
      .from(friendRequests)
      .where(eq(friendRequests.id, requestId));

    if (!request || request.toUserId !== session.user.id) {
      return {
        type: "error",
        message: "Friend request not found or unauthorized",
      };
    }

    await db
      .update(friendRequests)
      .set({ status: "rejected" })
      .where(eq(friendRequests.id, requestId));

    revalidatePath("/friends");

    return { type: "success", message: "Friend request rejected" };
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    return { type: "error", message: "Failed to reject request" };
  }
};

export const cancelFriendRequest = async (
  requestId: string,
): Promise<ActionResult> => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { type: "error", message: "Not authenticated" };
    }

    const [request] = await db
      .select()
      .from(friendRequests)
      .where(eq(friendRequests.id, requestId));

    if (!request || request.fromUserId !== session.user.id) {
      return {
        type: "error",
        message: "Friend request not found or unauthorized",
      };
    }

    await db.delete(friendRequests).where(eq(friendRequests.id, requestId));

    revalidatePath("/friends");

    return { type: "success", message: "Friend request cancelled" };
  } catch (error) {
    console.error("Error cancelling friend request:", error);
    return { type: "error", message: "Failed to cancel request" };
  }
};

export const sendFriendRequest = async (
  formInput: string,
): Promise<ActionResult> => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { type: "error", message: "Not authenticated" };
    }

    const [recipient] = await db
      .select()
      .from(users)
      .where(
        or(
          eq(users.username, formInput),
          eq(users.email, formInput),
          eq(users.name, formInput),
        ),
      );

    if (!recipient) {
      return { type: "error", message: "User not found" };
    }

    if (recipient.id === session.user.id) {
      return { type: "error", message: "You can't add yourself" };
    }

    // Check for existing pending or accepted request
    const [existing] = await db
      .select()
      .from(friendRequests)
      .where(
        and(
          or(
            and(
              eq(friendRequests.fromUserId, session.user.id),
              eq(friendRequests.toUserId, recipient.id),
            ),
            and(
              eq(friendRequests.fromUserId, recipient.id),
              eq(friendRequests.toUserId, session.user.id),
            ),
          ),
          eq(friendRequests.status, "pending"),
        ),
      );

    if (existing) {
      return { type: "error", message: "Request already exists" };
    }

    await db.insert(friendRequests).values({
      fromUserId: session.user.id,
      toUserId: recipient.id,
    });

    revalidatePath("/friends");

    return { type: "success", message: `Request sent to ${formInput}` };
  } catch (error) {
    console.error("Error sending friend request:", error);
    return { type: "error", message: "Failed to send friend request" };
  }
};

export const removeFriend = async (friendId: string): Promise<ActionResult> => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { type: "error", message: "Not authenticated" };
    }

    await db
      .delete(friends)
      .where(
        and(
          eq(friends.userId, session.user.id),
          eq(friends.friendId, friendId),
        ),
      );

    await db
      .delete(friends)
      .where(
        and(
          eq(friends.userId, friendId),
          eq(friends.friendId, session.user.id),
        ),
      );

    revalidatePath("/friends");

    return { type: "success", message: "Friend removed" };
  } catch (error) {
    console.error("Error removing friend:", error);
    return { type: "error", message: "Failed to remove friend" };
  }
};
