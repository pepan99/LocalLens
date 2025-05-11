import { z } from "zod";

// Define the schema for event creation form
export const createEventSchema = z.object({
  title: z
    .string()
    .min(3, {
      message: "Title must be at least 3 characters.",
    })
    .max(100, {
      message: "Title must not exceed 100 characters.",
    }),
  description: z.string().max(1000, {
    message: "Description must not exceed 1000 characters.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  location: z.string().optional(),
  customLocation: z.string().optional(),
  date: z.date({
    required_error: "Please select a date.",
  }),
  time: z.string({
    required_error: "Please select a time.",
  }),
  imageUrl: z.string().optional(),
  capacity: z.coerce.number().int(),
  isPrivate: z.boolean(),
});

// Type for the form values
export type CreateEventFormValues = z.infer<typeof createEventSchema>;

// // Schema for RSVP form
// const rsvpFormSchema = z.object({
//   status: z.string(),
//   guests: z.number().min(0).max(10).optional(),
//   note: z.string().max(200).optional(),
// });

// type RSVPFormValues = z.infer<typeof rsvpFormSchema>;
