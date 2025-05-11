"use client";

import {
  DeleteEventDialog,
  EventActions,
  EventHeader,
  EventInformation,
} from "@/components/events/event-detail";
import { RSVPAttendees, RSVPStatusEnum } from "@/components/events/rsvp";
import { deleteEvent } from "@/modules/events/actions/events";
import { EventType } from "@/modules/events/types/events";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ClientEventDetailPageProps {
  initialEvent: EventType;
}

const ClientEventDetailPage = ({
  initialEvent,
}: ClientEventDetailPageProps) => {
  const { id } = useParams();
  const eventId = Array.isArray(id) ? id[0] : (id as string);
  const router = useRouter();
  const session = useSession();
  const isOwner = initialEvent.creatorId === session.data?.user.id;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Convert EventType to EventDetail for compatibility with components

  const handleDeleteEvent = async () => {
    const result = await deleteEvent(eventId);

    if (result.type === "success") {
      toast.success("Event deleted successfully");
      router.push("/events");
    } else {
      toast.error(result.message || "Failed to delete the event");
    }

    setIsDeleteDialogOpen(false);
  };

  const handleOpenDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleRSVPChange = (eventId: string, status: RSVPStatusEnum) => {
    // In a real app, you would update the UI based on the new RSVP status
    // This should be implemented using server actions
    console.log(`RSVP status changed for event ${eventId}: ${status}`);

    // Show toast notification
    const message =
      status === RSVPStatusEnum.GOING
        ? "You're going to this event!"
        : status === RSVPStatusEnum.MAYBE
          ? "You might attend this event."
          : "You've declined this event.";

    toast(message);
    router.refresh();
  };

  return (
    <div className="container mx-auto p-4">
      <EventHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EventInformation event={initialEvent} />

          {/* Attendees list - only show if not owner */}
          {!isOwner && (
            <div className="mt-6">
              <RSVPAttendees eventId={eventId} />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <EventActions
            event={initialEvent}
            onDelete={handleOpenDeleteDialog}
            onRSVPChange={handleRSVPChange}
          />

          {/* Attendees list - only show if owner */}
          {isOwner && <RSVPAttendees eventId={eventId} />}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteEventDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
};

export default ClientEventDetailPage;
