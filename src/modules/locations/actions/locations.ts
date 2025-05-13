"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { friends } from "@/db/schemas/friends";
import { userLocation } from "@/db/schemas/user-locations";
import { users } from "@/db/schemas/users";
import { ActionResult } from "@/types/result";
import { and, eq } from "drizzle-orm";
import { getUserLocation } from "../server/queries";
import { UserWithLocation } from "../types/locations";

/**
 * Create a new event
 */
export const updateUserLocation = async (
  newLocation: [number, number],
): Promise<ActionResult> => {
  try {
    // Get the current user
    const session = await auth();
    if (!session?.user?.id) {
      return { type: "error", message: "Not authenticated" };
    }

    // Check if the user is already in the database
    const location = await getUserLocation();
    if (location.type === "error") {
      return { type: "error", message: "User already exists" };
    }

    if (location.data === null) {
      // Insert the event into the database
      await db.insert(userLocation).values({
        userId: session.user.id,
        latitude: newLocation[0],
        longitude: newLocation[1],
      });
    } else {
      // Update the user's location in the database
      await db
        .update(userLocation)
        .set({
          latitude: newLocation[0],
          longitude: newLocation[1],
        })
        .where(eq(userLocation.userId, session.user.id));
    }

    return {
      type: "success",
      message: "Location updated successfully",
    };
  } catch (error) {
    console.error("Error creating event:", error);
    return { type: "error", message: "Failed to update location" };
  }
};

export const enableLocationSharing = async (): Promise<ActionResult> => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { type: "error", message: "Not authenticated" };
    }

    await db
      .update(users)
      .set({
        isSharingLocation: true,
      })
      .where(eq(users.id, session.user.id));
    return {
      type: "success",
      message: "Location sharing enabled",
    };
  } catch (error) {
    console.error("Error creating event:", error);
    return { type: "error", message: "Failed to update location sharing" };
  }
};

export const disableLocationSharing = async (): Promise<ActionResult> => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { type: "error", message: "Not authenticated" };
    }

    await db
      .update(users)
      .set({
        isSharingLocation: false,
      })
      .where(eq(users.id, session.user.id));
    return {
      type: "success",
      message: "Location sharing disabled",
    };
  } catch (error) {
    console.error("Error creating event:", error);
    return { type: "error", message: "Failed to update location sharing" };
  }
};

/**
 * Get all friends and their location
 */
export const friendsWithLocationAction = async (): Promise<
  UserWithLocation[]
> => {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return [];
    }

    const results = await db
      .select({
        id: users.id,
        name: users.name,
        imageUrl: users.imageUrl,
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        updatedAt: userLocation.updatedAt,
      })
      .from(friends)
      .innerJoin(users, eq(friends.friendId, users.id))
      .leftJoin(userLocation, eq(users.id, userLocation.userId))
      .where(
        and(eq(friends.userId, userId), eq(users.isSharingLocation, true)),
      );

    return results.map(friend => ({
      id: friend.id,
      name: friend.name ?? "Unknown",
      imageUrl: friend.imageUrl,
      coordinates:
        friend.latitude === null || friend.longitude === null
          ? null
          : [friend.latitude, friend.longitude],
      lastUpdated: friend.updatedAt ? new Date(friend.updatedAt) : null,
    }));
  } catch (error) {
    console.error("Error fetching friends with location:", error);
    return [];
  }
};
