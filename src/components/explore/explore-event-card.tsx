"use client";

import { RSVPManager, RSVPStatusEnum } from "@/components/events/rsvp";
import { Button } from "@/components/ui/button";
import { EventType } from "@/modules/events/types/events";
import { Calendar, MapPin, Star, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { THEME_COLOR } from "./utils";

interface ExploreEventCardProps {
  event: EventType;
  onRSVPChange?: (eventId: string, status: RSVPStatusEnum) => void;
}

const ExploreEventCard = ({ event, onRSVPChange }: ExploreEventCardProps) => {
  const router = useRouter();
  const categoryClasses = `text-xs font-medium text-${THEME_COLOR}-700 bg-${THEME_COLOR}-100 px-2 py-0.5 rounded`;

  const handleViewDetails = () => {
    router.push(`/events/${event.id}`);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      {/* Event Header */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
        <span className={categoryClasses}>{event.category}</span>
      </div>

      {/* Event Details */}
      <div className="space-y-1.5 text-sm text-gray-600 mb-3">
        <div className="flex items-center">
          <Calendar size={14} className="mr-2 text-gray-500" />
          <span>
            {event.date.toDateString()}, {event.time}
          </span>
        </div>
        <div className="flex items-center">
          <MapPin size={14} className="mr-2 text-gray-500" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center">
          <Users size={14} className="mr-2 text-gray-500" />
          <span>{event.attendees} attending</span>
        </div>
      </div>

      {/* Rating and Distance */}
      <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
        <div className="flex items-center">
          <Star size={16} className="mr-1 text-yellow-500 fill-current" />
          <span className="font-medium">{event.rating.toFixed(1)}</span>
        </div>
        <span>{Math.floor(Math.random() * 31)} km</span>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <Button
          variant="secondary"
          className="cursor-pointer"
          onClick={handleViewDetails}
        >
          Details
        </Button>
        <RSVPManager
          event={event}
          eventTitle={event.title}
          buttonVariant="default"
          buttonSize="sm"
          onRSVPChange={onRSVPChange}
        />
      </div>
    </div>
  );
};

export default ExploreEventCard;
