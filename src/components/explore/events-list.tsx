"use client";

import { RSVPStatusEnum } from "../events/rsvp";
import { ScrollArea } from "../ui/scroll-area";
import ExploreEventCard from "./explore-event-card";
import { ExploreEvent } from "./utils";

interface EventsListProps {
  events: ExploreEvent[];
  onRSVPChange?: (eventId: string, status: RSVPStatusEnum) => void;
  activeTab: string;
}

const EventsList = ({ events, onRSVPChange, activeTab }: EventsListProps) => {
  if (events.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No events found for {activeTab}.
      </div>
    );
  }

  return (
    <ScrollArea className="h-[800] pr-6">
      <div className="flex-grow flex-col flex gap-4">
        {events.map(event => (
          <ExploreEventCard
            key={event.id}
            event={event}
            onRSVPChange={onRSVPChange}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default EventsList;
