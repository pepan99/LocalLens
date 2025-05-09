"use client";

import { EventType } from "@/types/events";
import { z } from "zod";

export const editEventSchema = z.object({
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
  isEventPrivate: z.boolean(),
});

export type EditEventFormValues = z.infer<typeof editEventSchema>;

export interface EventWithOwner extends EventType {
  isOwner: boolean;
}

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

export const MOCK_EVENTS: EventWithOwner[] = [
  {
    id: "1",
    title: "Tech Meetup in Brno",
    category: "Technology",
    date: "2025-05-10T18:00:00",
    location: "Impact Hub, Brno",
    coordinates: [49.19, 16.61],
    attendees: 24,
    rating: 4.5,
    isOwner: true,
    description:
      "Join us for an evening of tech talks and networking with local developers and tech enthusiasts. We'll be discussing the latest trends in web development, AI, and more.",
    capacity: "50",
    isEventPrivate: false,
  },
  {
    id: "2",
    title: "Weekend Farmers Market",
    category: "Food",
    date: "2025-05-09T09:00:00",
    location: "Freedom Square, Brno",
    coordinates: [49.2, 16.6],
    attendees: 120,
    rating: 4.8,
    isOwner: false,
    description:
      "Discover the freshest local produce, artisanal foods, and handcrafted goods at our weekend farmers market. Support local farmers and businesses while enjoying delicious treats.",
    capacity: "200",
    isEventPrivate: false,
  },
  {
    id: "3",
    title: "Art Exhibition Opening",
    category: "Arts",
    date: "2025-05-15T17:00:00",
    location: "Moravian Gallery, Brno",
    coordinates: [49.195, 16.605],
    attendees: 45,
    rating: 4.3,
    isOwner: false,
    description:
      "Be among the first to experience our new art exhibition featuring works from emerging local artists. The opening night includes a guided tour and a chance to meet the artists.",
    capacity: "75",
    isEventPrivate: false,
  },
  {
    id: "4",
    title: "Weekly Running Club",
    category: "Sports",
    date: "2025-05-07T19:00:00",
    location: "Lužánky Park, Brno",
    coordinates: [49.205, 16.615],
    attendees: 18,
    rating: 4.6,
    isOwner: true,
    description:
      "Join our friendly running group for a 5K run through the beautiful Lužánky Park. All fitness levels are welcome. We meet by the main entrance and finish with stretches and socializing.",
    capacity: "30",
    isEventPrivate: false,
  },
  {
    id: "5",
    title: "Jazz Night",
    category: "Music",
    date: "2025-05-12T20:00:00",
    location: "Music Lab, Brno",
    coordinates: [49.198, 16.607],
    attendees: 56,
    rating: 4.7,
    isOwner: false,
    description:
      "Enjoy an evening of live jazz music from talented local musicians. Our intimate venue provides the perfect atmosphere for this sophisticated musical experience.",
    capacity: "80",
    isEventPrivate: false,
  },
];

export const extractTimeFromDate = (dateString: string): string => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const AVAILABLE_LOCATIONS = Object.keys(locationCoordinates);
