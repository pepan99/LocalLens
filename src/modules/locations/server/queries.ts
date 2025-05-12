import { auth } from "@/auth";
import { db } from "@/db";
import { userLocation } from "@/db/schemas/user-locations";
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
    return [];
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};
