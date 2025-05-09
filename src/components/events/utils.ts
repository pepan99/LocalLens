"use client";

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

// Mock data for events
export const MOCK_EVENTS: Event[] = [
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
  },
];

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
export const sortEvents = (events: Event[], sortBy: string) => {
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
