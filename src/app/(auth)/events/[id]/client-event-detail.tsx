"use client";

import {
  DeleteEventDialog,
  EventActions,
  EventHeader,
  EventInformation,
} from "@/components/events/event-detail";
import { RSVPAttendees } from "@/components/events/rsvp";
import { deleteEvent } from "@/modules/events/actions/events";
import { AttendingUser, EventType } from "@/modules/events/types/events";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ClientEventDetailPageProps {
  initialEvent: EventType;
  attendees: AttendingUser[];
}

const ClientEventDetailPage = ({
  initialEvent,
  attendees,
}: ClientEventDetailPageProps) => {
  const { id } = useParams();
  const eventId = Array.isArray(id) ? id[0] : (id as string);
  const router = useRouter();
  const session = useSession();
  const isOwner = initialEvent.creatorId === session.data?.user.id;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  const handleRSVPChange = () => {
    router.refresh();
  };

  return (
    <div className="container mx-auto">
      <EventHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EventInformation event={initialEvent} />
        </div>

        <div className="space-y-6">
          <EventActions
            event={initialEvent}
            onDelete={handleOpenDeleteDialog}
            onRSVPChange={handleRSVPChange}
          />

          <RSVPAttendees attendees={attendees} />
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
