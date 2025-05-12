"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { userLocation } from "@/db/schemas/user-locations";
import { ActionResult } from "@/types/result";
import { eq } from "drizzle-orm";
import { getUserLocation } from "../server/queries";

/**
 * Create a new event
 */
export const updateUserLocation = async (
  newLocation: [number, number],
): Promise<ActionResult> => {
  try {
    console.log("updateUserLocation", newLocation);

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
      console.log("User does not exist in the database");

      // Insert the event into the database
      await db.insert(userLocation).values({
        userId: session.user.id,
        latitude: newLocation[0],
        longitude: newLocation[1],
      });
    } else {
      console.log("User already exists in the database");
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
      message: "Event created successfully",
    };
  } catch (error) {
    console.error("Error creating event:", error);
    return { type: "error", message: "Failed to create event" };
  }
};
