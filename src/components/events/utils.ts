"use client";

import { EventType } from "@/modules/events/types/events";

// Event type definition
export type Event = {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  coordinates: [number, number];
  attendees: number;
  rating: number;
  isOwner: boolean;
};

// Categories for events
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

// Format date to be more readable
export const formatEventDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Sort events by different criteria
export const sortEvents = (events: EventType[], sortBy: string) => {
  switch (sortBy) {
    case "date-asc":
      return [...events].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
    case "date-desc":
      return [...events].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    case "rating":
      return [...events].sort((a, b) => b.rating - a.rating);
    case "popularity":
      return [...events].sort((a, b) => b.attendees - a.attendees);
    default:
      return events;
  }
};
