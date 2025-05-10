"use client";

import {
  EditEventForm,
  EditEventFormValues,
  EventWithOwner,
  LoadingState,
  MOCK_EVENTS,
  NotFoundState,
} from "@/components/events/event-edit";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const EditEventPage = () => {
  // Get event ID from params
  const param = useParams();
  const eventId = param.id as string;

  const router = useRouter();
  const [event, setEvent] = useState<EventWithOwner | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch event data
  useEffect(() => {
    // Simulate API fetch
    const eventData = MOCK_EVENTS.find(e => e.id === eventId);

    if (eventData) {
      setEvent(eventData);
    }
    setLoading(false);
  }, [eventId]);

  // Handle form submission
  const handleSubmit = (
    values: EditEventFormValues,
    coordinates: [number, number] | null,
  ) => {
    // In a real application, you would send the data to your API
    console.log("Updated event:", {
      ...values,
      id: eventId,
      coordinates,
    });

    // Redirect back to the event page
    router.push(`/events/${eventId}`);
  };

  // Handle cancel button
  const handleCancel = () => {
    router.push(`/events/${eventId}`);
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!event) {
    return <NotFoundState />;
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <EditEventForm
        event={event}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default EditEventPage;
