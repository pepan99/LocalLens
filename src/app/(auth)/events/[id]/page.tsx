"use client";

import {
  DeleteEventDialog,
  EventActions,
  EventDetail,
  EventHeader,
  EventInformation,
  LoadingState,
  MOCK_EVENT_DETAILS,
  NotFoundState,
} from "@/components/events/event-detail";
import { RSVPAttendees, RSVPStatusEnum } from "@/components/events/rsvp";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const EventDetailPage = () => {
  const { id } = useParams();
  const eventId = Array.isArray(id) ? id[0] : (id as string);

  const router = useRouter();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    // Simulating API fetch
    const eventData = MOCK_EVENT_DETAILS.find(e => e.id === eventId);

    if (eventData) {
      setEvent(eventData);
    }
    setLoading(false);
  }, [eventId]);

  const handleDeleteEvent = () => {
    // In a real application, you would send a delete request to your API
    console.log("Deleting event:", event?.id);

    // Redirect to events page after delete
    router.push("/events");
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
    console.log(`RSVP status changed for event ${eventId}: ${status}`);

    // Show toast notification
    const message =
      status === RSVPStatusEnum.GOING
        ? "You're going to this event!"
        : status === RSVPStatusEnum.MAYBE
          ? "You might attend this event."
          : "You've declined this event.";

    toast(message);
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!event) {
    return <NotFoundState />;
  }

  return (
    <div className="container mx-auto p-4">
      <EventHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EventInformation event={event} />

          {/* Attendees list - only show if not owner */}
          {!event.isOwner && (
            <div className="mt-6">
              <RSVPAttendees eventId={eventId} />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <EventActions
            event={event}
            onDelete={handleOpenDeleteDialog}
            onRSVPChange={handleRSVPChange}
          />

          {/* Attendees list - only show if owner */}
          {event.isOwner && <RSVPAttendees eventId={eventId} />}
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

export default EventDetailPage;
