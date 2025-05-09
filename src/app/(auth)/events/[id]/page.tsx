"use client";

import {
  DeleteEventDialog,
  EventActions,
  EventDetail,
  EventInformation,
  LoadingState,
  MOCK_EVENT_DETAILS,
  NotFoundState,
} from "@/components/events/event-detail";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const EventDetailPage = () => {
  const { id } = useParams();

  const router = useRouter();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    // Simulating API fetch
    const eventData = MOCK_EVENT_DETAILS.find(e => e.id === id);

    if (eventData) {
      setEvent(eventData);
    }
    setLoading(false);
  }, [id]);

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

  if (loading) {
    return <LoadingState />;
  }

  if (!event) {
    return <NotFoundState />;
  }

  return (
    <div className="container mx-auto p-4">
      <Button variant="outline" asChild className="mb-4">
        <Link href="/events">
          <span className="mr-2">←</span> Back to Events
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EventInformation event={event} />
        </div>

        <div>
          <EventActions event={event} onDelete={handleOpenDeleteDialog} />
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
