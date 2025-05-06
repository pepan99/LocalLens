"use client";

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
import { Calendar, MapPin, Star, Users } from "lucide-react";
import Link from "next/link";
import { Marker, Popup } from "react-leaflet";

// Define custom icon for event markers
const createEventIcon = (category: string) => {
  // You can customize icons based on category
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

  return L.divIcon({
    className: "custom-event-marker",
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; display: flex; justify-content: center; align-items: center; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"><span style="color: white; font-weight: bold;">E</span></div>`,
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

const EventMarker = ({ event }: EventMarkerProps) => {
  return (
    <Marker position={event.coordinates} icon={createEventIcon(event.category)}>
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
              <Link href={`/dashboard/events/${event.id}`}>View Details</Link>
            </Button>
            <Button size="sm" variant="default">
              RSVP
            </Button>
          </CardFooter>
        </Card>
      </Popup>
    </Marker>
  );
};

export default EventMarker;
