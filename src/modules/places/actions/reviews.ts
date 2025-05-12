"use server";

import { randomUUID } from "crypto";
import { auth } from "@/auth";
import { db } from "@/db";
import { reviews } from "@/db/schemas/reviews";
import { ActionResult } from "@/types/result";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  CreateReviewInput,
  createReviewSchema,
  EditReviewInput,
  editReviewSchema,
} from "../schemas/review-schema";

/**
 * Create a new review for a place
 */
export const createReview = async (
  data: Omit<CreateReviewInput, "userId">,
): Promise<ActionResult> => {
  try {
    // Get the current user
    const session = await auth();
    if (!session?.user?.id) {
      return { type: "error", message: "Not authenticated" };
    }

    // Add user ID to the data
    const reviewInput: CreateReviewInput = {
      ...data,
      userId: session.user.id,
    };

    // Parse and validate the form data
    const parsedData = createReviewSchema.safeParse(reviewInput);

    if (!parsedData.success) {
      console.error("Validation error:", parsedData.error);
      return { type: "error", message: "Invalid review data" };
    }

    const reviewData = parsedData.data;

    // Insert the review into the database
    await db.insert(reviews).values({
      id: randomUUID(),
      placeId: reviewData.placeId,
      userId: reviewData.userId,
      rating: reviewData.rating,
      comment: reviewData.comment,
    });

    // Revalidate the place page
    revalidatePath(`/places/${reviewData.placeId}`);

    return {
      type: "success",
      message: "Review created successfully",
    };
  } catch (error) {
    console.error("Error creating review:", error);
    return { type: "error", message: "Failed to create review" };
  }
};

/**
 * Update an existing review
 */
export const updateReview = async (
  reviewId: string,
  data: EditReviewInput,
): Promise<ActionResult> => {
  try {
    // Get the current user
    const session = await auth();
    if (!session?.user?.id) {
      return { type: "error", message: "Not authenticated" };
    }

    // Parse and validate the form data
    const parsedData = editReviewSchema.safeParse(data);

    if (!parsedData.success) {
      console.error("Validation error:", parsedData.error);
      return { type: "error", message: "Invalid review data" };
    }

    const reviewData = parsedData.data;

    // Check if the review exists and is owned by the current user
    const [existingReview] = await db
      .select()
      .from(reviews)
      .where(
        and(eq(reviews.id, reviewId), eq(reviews.userId, session.user.id)),
      );

    if (!existingReview) {
      return {
        type: "error",
        message: "Review not found or you don't have permission to edit it",
      };
    }

    // Update the review
    await db
      .update(reviews)
      .set({
        ...reviewData,
      })
      .where(eq(reviews.id, reviewId));

    // Revalidate the place page
    revalidatePath(`/places/${existingReview.placeId}`);

    return {
      type: "success",
      message: "Review updated successfully",
    };
  } catch (error) {
    console.error("Error updating review:", error);
    return { type: "error", message: "Failed to update review" };
  }
};

/**
 * Delete a review
 */
export const deleteReview = async (reviewId: string): Promise<ActionResult> => {
  try {
    // Get the current user
    const session = await auth();
    if (!session?.user?.id) {
      return { type: "error", message: "Not authenticated" };
    }

    // Check if the review exists and is owned by the current user
    const [existingReview] = await db
      .select()
      .from(reviews)
      .where(
        and(eq(reviews.id, reviewId), eq(reviews.userId, session.user.id)),
      );

    if (!existingReview) {
      return {
        type: "error",
        message: "Review not found or you don't have permission to delete it",
      };
    }

    // Delete the review
    await db.delete(reviews).where(eq(reviews.id, reviewId));

    // Revalidate the place page
    revalidatePath(`/places/${existingReview.placeId}`);

    return {
      type: "success",
      message: "Review deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting review:", error);
    return { type: "error", message: "Failed to delete review" };
  }
};
