"use client";

import { Event } from "../utils";

// Extended event type with additional details
export interface EventDetail extends Event {
  description: string;
  capacity: number;
  isPrivate: boolean;
  imageUrl: string;
}

// Format date to be more readable
export const formatEventDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

// Format time to be more readable
export const formatEventTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Mock event data - would be fetched from an API in a real application
export const MOCK_EVENT_DETAILS: EventDetail[] = [
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
    capacity: 50,
    isPrivate: false,
    imageUrl: "",
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
    capacity: 200,
    isPrivate: false,
    imageUrl: "",
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
    capacity: 75,
    isPrivate: false,
    imageUrl: "",
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
    capacity: 30,
    isPrivate: false,
    imageUrl: "",
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
    capacity: 80,
    isPrivate: false,
    imageUrl: "",
  },
];
