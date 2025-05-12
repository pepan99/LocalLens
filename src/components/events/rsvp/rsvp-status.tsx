"use client";

import { Badge } from "@/components/ui/badge";
import { RSVPStatusEnum } from "@/modules/events/types/events";
import { CalendarCheck, CalendarClock, CalendarX } from "lucide-react";
import { getRSVPStatusText } from "./utils";

type RSVPStatusProps = {
  status: RSVPStatusEnum;
  className?: string;
  showIcon?: boolean;
};

const RSVPStatus = ({
  status,
  className = "",
  showIcon = true,
}: RSVPStatusProps) => {
  if (status === RSVPStatusEnum.NO_RESPONSE) {
    return null;
  }

  // Get appropriate icon based on RSVP status
  const getStatusIcon = () => {
    switch (status) {
      case RSVPStatusEnum.GOING:
        return <CalendarCheck className="h-3 w-3 mr-1" />;
      case RSVPStatusEnum.MAYBE:
        return <CalendarClock className="h-3 w-3 mr-1" />;
      case RSVPStatusEnum.NOT_GOING:
        return <CalendarX className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  // Get variant based on status
  const getVariant = ():
    | "default"
    | "secondary"
    | "destructive"
    | "outline" => {
    switch (status) {
      case RSVPStatusEnum.GOING:
        return "default";
      case RSVPStatusEnum.MAYBE:
        return "secondary";
      case RSVPStatusEnum.NOT_GOING:
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Badge variant={getVariant()} className={`flex items-center ${className}`}>
      {showIcon && getStatusIcon()}
      {getRSVPStatusText(status)}
    </Badge>
  );
};

export default RSVPStatus;
