"use client";

import { RSVPStatusEnum } from "@/modules/events/types/events";

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
