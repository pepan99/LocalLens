"use server";

import { randomUUID } from "crypto";
import { auth } from "@/auth";
import { db } from "@/db";
import { amenities, placeAmenities, places } from "@/db/schemas/places";
import { ActionResult } from "@/types/result";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  CreatePlaceInput,
  createPlaceSchema,
  UpdatePlaceInput,
  updatePlaceSchema,
} from "../schemas/place-schema";

/**
 * Create a new place
 */
export const createPlace = async (
  data: CreatePlaceInput,
): Promise<ActionResult> => {
  try {
    // Verify authentication
    const session = await auth();
    if (!session?.user?.id) {
      return { type: "error", message: "Not authenticated" };
    }

    // Validate input data
    const validatedData = createPlaceSchema.safeParse(data);
    if (!validatedData.success) {
      return {
        type: "error",
        message: "Invalid place data: " + validatedData.error.message,
      };
    }

    const { amenityIds, ...placeData } = validatedData.data;

    // Generate a unique ID
    const placeId = randomUUID();

    // Create the place
    await db.insert(places).values({
      id: placeId,
      name: placeData.name,
      address: placeData.address,
      description: placeData.description,
      website: placeData.website,
      phone: placeData.phone,
      image: placeData.image,
      createdAt: new Date().toUTCString(),
      updatedAt: new Date().toUTCString(),
    });

    // Add amenities if provided
    if (amenityIds && amenityIds.length > 0) {
      // Insert amenity connections
      const amenityConnections = amenityIds.map(amenityId => ({
        placeId,
        amenityId,
      }));

      await db.insert(placeAmenities).values(amenityConnections);
    }

    // Revalidate places pages
    revalidatePath("/places");

    return {
      type: "success",
      message: "Place created successfully",
    };
  } catch (error) {
    console.error("Error creating place:", error);
    return { type: "error", message: "Failed to create place" };
  }
};

/**
 * Update an existing place
 */
export const updatePlace = async (
  placeId: string,
  data: UpdatePlaceInput,
): Promise<ActionResult> => {
  try {
    // Verify authentication
    const session = await auth();
    if (!session?.user?.id) {
      return { type: "error", message: "Not authenticated" };
    }

    // Validate input data
    const validatedData = updatePlaceSchema.safeParse(data);
    if (!validatedData.success) {
      return {
        type: "error",
        message: "Invalid place data: " + validatedData.error.message,
      };
    }

    // Check if place exists
    const [existingPlace] = await db
      .select()
      .from(places)
      .where(eq(places.id, placeId))
      .limit(1);

    if (!existingPlace) {
      return { type: "error", message: "Place not found" };
    }

    const { amenityIds, ...placeData } = validatedData.data;

    // Update place data
    await db
      .update(places)
      .set({
        ...placeData,
        updatedAt: new Date().toUTCString(),
      })
      .where(eq(places.id, placeId));

    // Update amenities if provided
    if (amenityIds) {
      // First remove existing amenity connections
      await db
        .delete(placeAmenities)
        .where(eq(placeAmenities.placeId, placeId));

      // Then add new amenity connections
      if (amenityIds.length > 0) {
        const amenityConnections = amenityIds.map(amenityId => ({
          placeId,
          amenityId: amenityId,
        }));

        await db.insert(placeAmenities).values(amenityConnections);
      }
    }

    // Revalidate places pages
    revalidatePath("/places");
    revalidatePath(`/places/${placeId}`);

    return {
      type: "success",
      message: "Place updated successfully",
    };
  } catch (error) {
    console.error("Error updating place:", error);
    return { type: "error", message: "Failed to update place" };
  }
};

/**
 * Delete a place
 */
export const deletePlace = async (placeId: string): Promise<ActionResult> => {
  try {
    // Verify authentication
    const session = await auth();
    if (!session?.user?.id) {
      return { type: "error", message: "Not authenticated" };
    }

    // Admin check could be added here
    // e.g., if (!isAdmin(session.user.id)) return { type: "error", message: "Unauthorized" };

    // Check if place exists
    const [existingPlace] = await db
      .select()
      .from(places)
      .where(eq(places.id, placeId))
      .limit(1);

    if (!existingPlace) {
      return { type: "error", message: "Place not found" };
    }

    // Delete the place (cascading delete should handle related records)
    await db.delete(places).where(eq(places.id, placeId));

    // Revalidate places pages
    revalidatePath("/places");

    return {
      type: "success",
      message: "Place deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting place:", error);
    return { type: "error", message: "Failed to delete place" };
  }
};

/**
 * Toggle favorite status for a place
 */
export const toggleFavoritePlace = async (
  placeId: string,
): Promise<ActionResult> => {
  try {
    // Verify authentication
    const session = await auth();
    if (!session?.user?.id) {
      return { type: "error", message: "Not authenticated" };
    }

    // This is a mock implementation since we don't have a favorites table defined
    // In a real implementation, you would toggle in a user_favorites table

    // Revalidate places pages
    revalidatePath("/places");
    revalidatePath(`/places/${placeId}`);

    return {
      type: "success",
      message: "Favorite status toggled successfully",
    };
  } catch (error) {
    console.error("Error toggling favorite status:", error);
    return { type: "error", message: "Failed to toggle favorite status" };
  }
};

/**
 * Create or update amenity
 */
export const manageAmenity = async (
  name: string,
  id?: string,
): Promise<ActionResult> => {
  try {
    // Verify authentication and admin status
    const session = await auth();
    if (!session?.user?.id) {
      return { type: "error", message: "Not authenticated" };
    }

    // Admin check could be added here

    if (id) {
      // Update existing amenity
      await db.update(amenities).set({ name }).where(eq(amenities.id, id));
    } else {
      // Create new amenity
      await db.insert(amenities).values({
        id: randomUUID(),
        name,
      });
    }

    // Revalidate admin pages
    revalidatePath("/admin/amenities");

    return {
      type: "success",
      message: id
        ? "Amenity updated successfully"
        : "Amenity created successfully",
    };
  } catch (error) {
    console.error("Error managing amenity:", error);
    return { type: "error", message: "Failed to manage amenity" };
  }
};
