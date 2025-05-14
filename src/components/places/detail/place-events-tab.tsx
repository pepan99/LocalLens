"use client";

import EventCard from "@/components/events/components/event-card";
import { Button } from "@/components/ui/button";
import { EventType, RSVPStatusEnum } from "@/modules/events/types/events";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

type PlaceEventsTabProps = {
  placeId: string;
  upcomingEvents: EventType[];
};

export const PlaceEventsTab = ({
  placeId,
  upcomingEvents = [],
}: PlaceEventsTabProps) => {
  const [events, setEvents] = useState<EventType[]>(upcomingEvents);

  // Mock delete handler
  const handleDelete = (eventId: string) => {
    toast.info("Event deletion is not implemented yet");
    // For a real implementation, we would call a server action to delete the event
    // and then update the state
    // setEvents(events.filter(event => event.id !== eventId));
  };

  // Mock RSVP handler
  const handleRSVPChange = (eventId: string, status: RSVPStatusEnum) => {
    // For a real implementation, this would be handled by the RSVPManager component
    // and would update the events state after the server action completes
    setEvents(
      events.map(event =>
        event.id === eventId
          ? {
              ...event,
              rsvp: {
                status,
                guests: 0,
                note: "",
              },
            }
          : event,
      ),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Upcoming Events</h2>
        <Button variant="outline" asChild>
          <Link href={`/events/create?placeId=${placeId}`}>Create Event</Link>
        </Button>
      </div>

      {events && events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onDelete={handleDelete}
              onRSVPChange={handleRSVPChange}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gradient-to-br from-white to-purple-100/95 rounded-lg">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">No upcoming events</h3>
          <p className="mt-1 text-gray-500">
            Be the first to create an event at this place
          </p>
          <Button className="mt-4" asChild>
            <Link href={`/events/create?placeId=${placeId}`}>Create Event</Link>
          </Button>
        </div>
      )}
    </div>
  );
};
