"use client";

import { respondToEvent } from "@/modules/events/actions/events";
import { EventType, RSVPStatusEnum } from "@/modules/events/types/events";
import { is } from "drizzle-orm";
import { Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import RSVPButton from "./rsvp-button";
import RSVPDialog from "./rsvp-dialog";

type RSVPManagerProps = {
  event: EventType;
  eventTitle: string;
  buttonVariant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  buttonClassName?: string;
  onRSVPChange?: (eventId: string, status: RSVPStatusEnum) => void;
};

const RSVPManager = ({
  event,
  eventTitle,
  buttonVariant = "default",
  buttonSize = "sm",
  buttonClassName = "",
  onRSVPChange,
}: RSVPManagerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleRSVP = async (
    eventId: string,
    status: RSVPStatusEnum,
    guests?: number,
    note?: string,
  ) => {
    setIsSubmitting(true);

    try {
      setIsSubmitting(true);
      await respondToEvent(eventId, {
        status: status,
        guests: guests,
        note: note,
      });
      if (onRSVPChange) {
        onRSVPChange(eventId, status);
      }
    } catch {
      toast.error("Failed to submit your RSVP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <RSVPButton
        event={event}
        onOpenDialog={handleOpenDialog}
        variant={buttonVariant}
        size={buttonSize}
        className={buttonClassName}
        isLoading={isSubmitting}
      />

      <RSVPDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        event={event}
        eventTitle={eventTitle}
        onRSVP={handleRSVP}
      />
    </>
  );
};

export default RSVPManager;
