"use client";

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
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters.",
    })
    .max(1000, {
      message: "Description must not exceed 1000 characters.",
    }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  location: z.string().min(3, {
    message: "Location must be at least 3 characters.",
  }),
  customLocation: z.string().optional(),
  date: z.date({
    required_error: "Please select a date.",
  }),
  time: z.string({
    required_error: "Please select a time.",
  }),
  imageUrl: z.string().optional(),
  capacity: z.string().min(1, {
    message: "Please specify a capacity.",
  }),
  isPrivate: z.boolean(),
});

// Type for the form values
export type CreateEventFormValues = z.infer<typeof createEventSchema>;

// Common location coordinates
export const locationCoordinates: Record<string, [number, number]> = {
  "Impact Hub, Brno": [49.19, 16.61],
  "Freedom Square, Brno": [49.1953, 16.6083],
  "Moravian Gallery, Brno": [49.1976, 16.6075],
  "Lužánky Park, Brno": [49.2097, 16.6158],
  "Music Lab, Brno": [49.1943, 16.6009],
  "Brno University of Technology": [49.2246, 16.5752],
  "Špilberk Castle, Brno": [49.1947, 16.6006],
  "Villa Tugendhat, Brno": [49.2134, 16.6158],
  "Brno Exhibition Centre": [49.1887, 16.5804],
  "Brno Train Station": [49.1905, 16.6128],
};

// List of available categories
export const EVENT_CATEGORIES = [
  "Technology",
  "Food",
  "Arts",
  "Sports",
  "Music",
  "Education",
  "Social",
  "Other",
];

// List of available locations
export const AVAILABLE_LOCATIONS = Object.keys(locationCoordinates);
