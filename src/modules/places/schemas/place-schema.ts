import { z } from "zod";

// Create place schema
export const createPlaceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  description: z.string().optional().nullable(),
  website: z.string().url().optional().nullable(),
  phone: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  amenityIds: z.array(z.string()).optional(),
});

// Update place schema
export const updatePlaceSchema = z
  .object({
    name: z.string().min(1, "Name is required").optional(),
    address: z.string().min(1, "Address is required").optional(),
    description: z.string().optional().nullable(),
    website: z.string().url().optional().nullable(),
    phone: z.string().optional().nullable(),
    image: z.string().optional().nullable(),
    amenityIds: z.array(z.string()).optional(),
  })
  .refine(data => Object.values(data).some(val => val !== undefined), {
    message: "At least one field must be provided for update",
  });

export type CreatePlaceInput = z.infer<typeof createPlaceSchema>;
export type UpdatePlaceInput = z.infer<typeof updatePlaceSchema>;
