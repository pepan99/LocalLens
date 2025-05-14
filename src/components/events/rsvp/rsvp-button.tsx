"use client";

import { Button } from "@/components/ui/button";
import { EventType, RSVPStatusEnum } from "@/modules/events/types/events";
import { CalendarCheck, CalendarClock, CalendarX, Loader } from "lucide-react";
import { getRSVPStatusColor, getRSVPStatusText } from "./utils";

interface RSVPButtonProps {
  event: EventType;
  onOpenDialog: () => void;
  className?: string;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
}

const RSVPButton = ({
  event,
  onOpenDialog,
  className = "",
  variant = "default",
  size = "sm",
  isLoading = false,
}: RSVPButtonProps) => {
  const status = event.rsvp?.status ?? RSVPStatusEnum.NO_RESPONSE;
  // Get appropriate icon based on RSVP status
  const getStatusIcon = () => {
    if (isLoading) {
      return <Loader className="h-4 w-4 mr-1 animate-spin" />;
    }

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
      onClick={() => onOpenDialog()}
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
