"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { friendRequests, friends } from "@/db/schemas/schema";
import { ActionResult } from "@/types/result";
import { eq } from "drizzle-orm";
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
