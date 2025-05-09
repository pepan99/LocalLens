"use client";

export type ExploreEvent = {
  id: number;
  name: string;
  category: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  rating: number;
  distance: number;
};

export const mockEvents: ExploreEvent[] = [
  {
    id: 1,
    name: "Weekend Farmers Market",
    category: "Food",
    date: "Fri, May 9",
    time: "09:00 AM",
    location: "Freedom Square, Brno",
    attendees: 120,
    rating: 4.8,
    distance: 0.3,
  },
  {
    id: 2,
    name: "Art Exhibition Opening",
    category: "Arts",
    date: "Thu, May 15",
    time: "05:00 PM",
    location: "Moravian Gallery, Brno",
    attendees: 45,
    rating: 4.3,
    distance: 0.5,
  },
  {
    id: 3,
    name: "Jazz Night",
    category: "Music",
    date: "Mon, May 12",
    time: "08:00 PM",
    location: "Metro Music Bar, Brno",
    attendees: 63,
    rating: 4.7,
    distance: 0.7,
  },
  {
    id: 4,
    name: "Tech Meetup Brno",
    category: "Tech",
    date: "Tue, May 13",
    time: "06:30 PM",
    location: "Impact Hub, Brno",
    attendees: 85,
    rating: 4.9,
    distance: 1.1,
  },
  {
    id: 5,
    name: "Book Club Meeting",
    category: "Literature",
    date: "Mon, May 5",
    time: "07:00 PM",
    location: "Central Library, Brno",
    attendees: 25,
    rating: 4.5,
    distance: 0.9,
  },
];

export type FilterTab = "All" | "Today" | "This Week";

export const getTodayDateString = (): string => {
  const today = new Date();

  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
  };

  return new Intl.DateTimeFormat("en-US", options)
    .format(today)
    .replace(",", "");
};

export const isThisWeek = (eventDateStr: string): boolean => {
  // For demo purposes, we're using a hardcoded list of dates
  // In a real app, you'd compare the date to the current week
  const currentWeekMockDates = ["Mon, May 5", "Fri, May 9"];
  return currentWeekMockDates.some(d => eventDateStr.includes(d));
};

export const filterEvents = (
  events: ExploreEvent[],
  filterTab: FilterTab,
): ExploreEvent[] => {
  const todayStr = getTodayDateString();

  switch (filterTab) {
    case "Today":
      return events.filter(event => event.date.includes(todayStr));
    case "This Week":
      return events.filter(event => isThisWeek(event.date));
    case "All":
    default:
      return events;
  }
};

export const THEME_COLOR = "indigo";
