"use client";

import { respondToEvent } from "@/modules/events/actions/events";
import { EventType, RSVPStatusEnum } from "@/modules/events/types/events";
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
  const [_isSubmitting, setIsSubmitting] = useState(false);

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
      const res = await respondToEvent(eventId, {
        status: status,
        guests: guests,
        note: note,
      });

      // if (res.type === "error") {
      //   toast.error("Failed to submit your RSVP. Please try again.");
      //   return;
      // }

      const message =
        status === RSVPStatusEnum.GOING
          ? "You're going to this event!"
          : status === RSVPStatusEnum.MAYBE
            ? "Your tentative response has been saved."
            : "You've declined this event.";

      // toast.success(message);

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
