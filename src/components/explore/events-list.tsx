"use client";

import { RSVPStatusEnum } from "../events/rsvp";
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
    <div className="flex-grow space-y-4 overflow-y-auto pr-1">
      {events.map(event => (
        <ExploreEventCard
          key={event.id}
          event={event}
          onRSVPChange={onRSVPChange}
        />
      ))}
    </div>
  );
};

export default EventsList;
