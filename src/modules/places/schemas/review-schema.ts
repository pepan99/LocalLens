import { z } from "zod";

// Schema for creating a new review
export const createReviewSchema = z
  .object({
    placeId: z.string().min(1, "Place ID is required"),
    userId: z.string().min(1, "User ID is required"),
    rating: z.number().int().min(1).max(5),
    comment: z.string().max(1000).optional().nullable(),
  })
  .strict();

// Schema for editing an existing review
export const editReviewSchema = z
  .object({
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().max(1000).optional().nullable(),
  })
  .strict()
  .refine(
    data => {
      return data.rating !== undefined || data.comment !== undefined;
    },
    {
      message: "At least one field must be updated",
      path: ["_errors"],
    },
  );

// Schema for a review entity in the database
export const reviewSchema = z.object({
  id: z.string(),
  placeId: z.string(),
  userId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Schema for review API responses
export const reviewResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  review: reviewSchema.optional(),
});

// Export types
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type EditReviewInput = z.infer<typeof editReviewSchema>;
export type ReviewType = z.infer<typeof reviewSchema>;
export type ReviewResponse = z.infer<typeof reviewResponseSchema>;
