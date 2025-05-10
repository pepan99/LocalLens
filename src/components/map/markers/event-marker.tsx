"use client";

import {
  getUserRSVPStatus,
  isUserAttending,
  RSVPManager,
  RSVPStatusEnum,
} from "@/components/events/rsvp";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import L from "leaflet";
import {
  Calendar,
  Check,
  Clock,
  HelpCircle,
  MapPin,
  Star,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Marker, Popup } from "react-leaflet";

// Define custom icon for event markers with RSVP status
const createEventIcon = (category: string, rsvpStatus: RSVPStatusEnum) => {
  // Base color by category
  let color = "#0ea5e9"; // Default blue

  switch (category) {
    case "Technology":
      color = "#0ea5e9"; // Blue
      break;
    case "Food":
      color = "#f97316"; // Orange
      break;
    case "Arts":
      color = "#8b5cf6"; // Purple
      break;
    case "Sports":
      color = "#22c55e"; // Green
      break;
    case "Music":
      color = "#f43f5e"; // Pink
      break;
    default:
      color = "#0ea5e9"; // Default blue
  }

  // RSVP status indicator
  let rsvpIndicator = "";
  if (rsvpStatus === RSVPStatusEnum.GOING) {
    rsvpIndicator = `<div style="position: absolute; top: -5px; right: -5px; width: 16px; height: 16px; background-color: #10b981; border-radius: 50%; border: 2px solid white; display: flex; justify-content: center; align-items: center;">
                      <span style="color: white; font-size: 10px;">✓</span>
                     </div>`;
  } else if (rsvpStatus === RSVPStatusEnum.MAYBE) {
    rsvpIndicator = `<div style="position: absolute; top: -5px; right: -5px; width: 16px; height: 16px; background-color: #f59e0b; border-radius: 50%; border: 2px solid white; display: flex; justify-content: center; align-items: center;">
                      <span style="color: white; font-size: 10px;">?</span>
                     </div>`;
  } else if (rsvpStatus === RSVPStatusEnum.NOT_GOING) {
    rsvpIndicator = `<div style="position: absolute; top: -5px; right: -5px; width: 16px; height: 16px; background-color: #ef4444; border-radius: 50%; border: 2px solid white; display: flex; justify-content: center; align-items: center;">
                      <span style="color: white; font-size: 10px;">✕</span>
                     </div>`;
  }

  return L.divIcon({
    className: "custom-event-marker",
    html: `<div style="position: relative; width: 30px; height: 30px;">
             <div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; display: flex; justify-content: center; align-items: center; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">
               <span style="color: white; font-weight: bold;">E</span>
             </div>
             ${rsvpIndicator}
           </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

type EventMarkerProps = {
  event: {
    id: string;
    title: string;
    category: string;
    date: string;
    location: string;
    coordinates: [number, number];
    attendees: number;
    rating: number;
  };
  onRSVPChange?: (eventId: string, status: RSVPStatusEnum) => void;
};

const formatEventDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const EventMarker = ({ event, onRSVPChange }: EventMarkerProps) => {
  const [rsvpStatus, setRsvpStatus] = useState<RSVPStatusEnum>(
    RSVPStatusEnum.NO_RESPONSE,
  );
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [marker, setMarker] = useState<L.Marker | null>(null);

  // Get the current RSVP status when component mounts and when RSVP changes
  useEffect(() => {
    const status = getUserRSVPStatus(event.id);
    setRsvpStatus(status);

    // Update marker icon if marker ref exists
    if (marker) {
      marker.setIcon(createEventIcon(event.category, status));
    }
  }, [event.id, event.category, marker]);

  // Handle RSVP status change
  const handleRSVPChange = (eventId: string, status: RSVPStatusEnum) => {
    setRsvpStatus(status);

    // Update the marker icon with the new status
    if (marker) {
      marker.setIcon(createEventIcon(event.category, status));
    }

    if (onRSVPChange) {
      onRSVPChange(eventId, status);
    }
  };

  // Handle marker reference
  const setMarkerRef = (ref: L.Marker) => {
    setMarker(ref);
    // Set initial icon with RSVP status once we have the marker reference
    if (ref) {
      ref.setIcon(createEventIcon(event.category, rsvpStatus));
    }
  };

  // Check if popup is open/closed
  const handlePopupOpen = () => {
    setIsPopupOpen(true);
    // Refresh RSVP status when popup opens
    const status = getUserRSVPStatus(event.id);
    setRsvpStatus(status);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  return (
    <Marker
      position={event.coordinates}
      icon={createEventIcon(event.category, rsvpStatus)}
      ref={setMarkerRef}
      eventHandlers={{
        popupopen: handlePopupOpen,
        popupclose: handlePopupClose,
      }}
    >
      <Popup className="event-popup" minWidth={280} maxWidth={320}>
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-2 pt-1 px-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{event.title}</CardTitle>
              <Badge variant="outline">{event.category}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-2 px-3">
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formatEventDate(event.date)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{event.location}</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-2">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>{event.attendees} attending</span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
                <span>{event.rating}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-0 px-3 pb-1">
            <Button size="sm" variant="ghost" asChild>
              <Link href={`/events/${event.id}`}>View Details</Link>
            </Button>
            <RSVPManager
              eventId={event.id}
              eventTitle={event.title}
              buttonVariant="default"
              buttonSize="sm"
              onRSVPChange={handleRSVPChange}
            />
          </CardFooter>
        </Card>
      </Popup>
    </Marker>
  );
};

export default EventMarker;
