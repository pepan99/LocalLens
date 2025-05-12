"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { friends } from "@/db/schemas/friends";
import { userLocation } from "@/db/schemas/user-locations";
import { users } from "@/db/schemas/users";
import { ActionResultWithData } from "@/types/result";
import { eq } from "drizzle-orm";
import { mapDbLocationToUserLocation } from "..";
import { UserLocation, UserWithLocation } from "../types/locations";

export const getUserLocation = async (): Promise<
  ActionResultWithData<UserLocation | null>
> => {
  const session = await auth();
  if (!session?.user?.id)
    return { type: "error", message: "Not authenticated" };

  const rows = await db
    .select({
      location: userLocation,
    })
    .from(userLocation)
    .where(eq(userLocation.userId, session.user.id));

  return {
    type: "success",
    data:
      rows.length > 0 ? mapDbLocationToUserLocation(rows[0].location) : null,
  };
};

/**
 * Get all friends and their location
 */
export const getUsersWithLocation = async (): Promise<UserWithLocation[]> => {
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
      .where(eq(friends.userId, userId));

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
