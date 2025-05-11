"use client";

import { EventType } from "@/modules/events/types/events";

export type FilterTab = "All" | "Today" | "This Week";

export const isThisWeek = (eventDate: Date): boolean => {
  // For demo purposes, we're using a hardcoded list of dates
  // In a real app, you'd compare the date to the current week

  return (
    eventDate.getTime() > new Date().getTime() &&
    eventDate.getTime() < new Date().getTime() + 7 * 24 * 60 * 60 * 1000
  );
};
export const filterEvents = (
  events: EventType[],
  filterTab: FilterTab,
): EventType[] => {
  switch (filterTab) {
    case "Today":
      return events.filter(
        event => event.date.getDay() === new Date().getDay(),
      );
    case "This Week":
      return events.filter(event => isThisWeek(event.date));
    case "All":
    default:
      return events;
  }
};

export const THEME_COLOR = "indigo";
