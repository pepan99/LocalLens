"use client";

import { RSVPManager } from "@/components/events/rsvp";
import {
  calculateDistance,
  useLocation,
} from "@/components/map/location_provider";
import { Button } from "@/components/ui/button";
import { EventType, RSVPStatusEnum } from "@/modules/events/types/events";
import { Calendar, MapPin, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { THEME_COLOR } from "./utils";

interface ExploreEventCardProps {
  event: EventType;
  onRSVPChange?: (eventId: string, status: RSVPStatusEnum) => void;
}

const ExploreEventCard = ({ event, onRSVPChange }: ExploreEventCardProps) => {
  const router = useRouter();
  const categoryClasses = `text-xs font-medium text-${THEME_COLOR}-700 bg-${THEME_COLOR}-100 px-2 py-0.5 rounded`;

  // Get user location
  const { position, loading, error } = useLocation();

  // Calculate distance between user and event
  const distance = useMemo(() => {
    if (position !== null) {
      return calculateDistance(
        position[0],
        position[1],
        event.latitude,
        event.longitude,
      );
    }
    return null;
  }, [position, event.latitude, event.longitude]);

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

      {/* Distance information */}
      <div className="flex justify-end items-center text-sm text-gray-600 mb-4">
        <MapPin size={14} className="mr-1 text-gray-500" />
        {distance !== null ? (
          <span className="font-medium">
            {distance < 1
              ? `${Math.round(distance * 1000)} m`
              : `${distance.toFixed(1)} km`}
          </span>
        ) : loading ? (
          <span className="text-gray-400 italic">Loading distance...</span>
        ) : error ? (
          <span className="text-gray-400 italic">Distance unavailable</span>
        ) : (
          <span className="text-gray-400 italic">Distance unavailable</span>
        )}
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
