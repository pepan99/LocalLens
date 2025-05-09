"use client";

import { Button } from "@/components/ui/button";
import { CalendarCheck, CalendarClock, CalendarX } from "lucide-react";
import {
  getRSVPStatusColor,
  getRSVPStatusText,
  getUserRSVPStatus,
  RSVPStatusEnum,
} from "./utils";

interface RSVPButtonProps {
  eventId: string;
  onOpenDialog: (eventId: string) => void;
  className?: string;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

const RSVPButton = ({
  eventId,
  onOpenDialog,
  className = "",
  variant = "default",
  size = "sm",
}: RSVPButtonProps) => {
  const status = getUserRSVPStatus(eventId);

  // Get appropriate icon based on RSVP status
  const getStatusIcon = () => {
    switch (status) {
      case RSVPStatusEnum.GOING:
        return <CalendarCheck className="h-4 w-4 mr-1" />;
      case RSVPStatusEnum.MAYBE:
        return <CalendarClock className="h-4 w-4 mr-1" />;
      case RSVPStatusEnum.NOT_GOING:
        return <CalendarX className="h-4 w-4 mr-1" />;
      default:
        return <CalendarCheck className="h-4 w-4 mr-1" />;
    }
  };

  // RSVP button styles based on status
  const getButtonVariant = () => {
    if (status === RSVPStatusEnum.NO_RESPONSE) {
      return variant;
    }
    return "outline" as const;
  };

  return (
    <Button
      size={size}
      variant={getButtonVariant()}
      onClick={() => onOpenDialog(eventId)}
      className={`flex items-center ${className}`}
    >
      {getStatusIcon()}
      <span
        className={
          status !== RSVPStatusEnum.NO_RESPONSE
            ? getRSVPStatusColor(status)
            : ""
        }
      >
        {getRSVPStatusText(status)}
      </span>
    </Button>
  );
};

export default RSVPButton;
