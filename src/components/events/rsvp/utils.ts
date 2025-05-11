"use client";

import { RSVPStatusEnum } from "@/db/schemas/schema";

// RSVP Response Type
export type RSVPResponse = {
  eventId: string;
  userId: string;
  status: RSVPStatusEnum;
  timestamp: Date;
  guests?: number;
  note?: string;
};

// Mock user (in a real app this would come from auth)
export const CURRENT_USER = {
  id: "user123",
  name: "John Doe",
  email: "john@example.com",
};

// Mock RSVP data store (in a real app this would be in a database)
export const mockRSVPStore: { [key: string]: RSVPResponse } = {
  // Example: Event ID -> RSVP response
  "2": {
    eventId: "2",
    userId: CURRENT_USER.id,
    status: RSVPStatusEnum.GOING,
    timestamp: new Date("2025-05-01"),
    guests: 0,
  },
  "3": {
    eventId: "3",
    userId: CURRENT_USER.id,
    status: RSVPStatusEnum.MAYBE,
    timestamp: new Date("2025-05-02"),
    guests: 1,
    note: "Looking forward to it, but I might be late.",
  },
};

// Helper to get RSVP status for an event
export const getUserRSVPStatus = (eventId: string): RSVPStatusEnum => {
  const response = mockRSVPStore[eventId];
  return response ? response.status : RSVPStatusEnum.NO_RESPONSE;
};

// Helper to check if user is attending an event
export const isUserAttending = (eventId: string): boolean => {
  return getUserRSVPStatus(eventId) === RSVPStatusEnum.GOING;
};

// Helper to get color for RSVP status
export const getRSVPStatusColor = (status: RSVPStatusEnum): string => {
  switch (status) {
    case RSVPStatusEnum.GOING:
      return "text-green-600";
    case RSVPStatusEnum.MAYBE:
      return "text-amber-500";
    case RSVPStatusEnum.NOT_GOING:
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

// Helper to get text for RSVP status
export const getRSVPStatusText = (status: RSVPStatusEnum): string => {
  switch (status) {
    case RSVPStatusEnum.GOING:
      return "Going";
    case RSVPStatusEnum.MAYBE:
      return "Maybe";
    case RSVPStatusEnum.NOT_GOING:
      return "Not Going";
    default:
      return "Respond";
  }
};
