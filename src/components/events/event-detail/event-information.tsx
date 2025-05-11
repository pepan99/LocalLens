"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EventType } from "@/modules/events/types/events";
import { Calendar, Clock, MapPin, Star, Users } from "lucide-react";
import dynamic from "next/dynamic";

interface EventInformationProps {
  event: EventType;
}

const EventInformation = ({ event }: EventInformationProps) => {
  // Load Map component dynamically to avoid SSR issues
  const EventMap = dynamic(
    () => import("@/components/events/location-picker"),
    {
      ssr: false,
    },
  );

  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardHeader className="justify-between flex items-start">
        <CardTitle className="text-3xl">{event.title}</CardTitle>
        <Badge variant="outline" className="text-sm px-3 py-1">
          {event.category}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="text-lg mt-2 text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {event.date.toDateString()}
            </span>
            <span className="flex items-center gap-1 mt-1">
              <Clock className="h-4 w-4" />
              {event.date.toDateString()}
            </span>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">About This Event</h3>
          <p className="text-gray-700 whitespace-pre-line">
            {event.description}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Location</h3>
          <p className="flex items-center gap-2 text-gray-700 mb-3">
            <MapPin className="h-5 w-5 text-gray-500" />
            {event.location}
          </p>
          <div className="h-[300px] border rounded-md overflow-hidden">
            {/* Render the event location on a map */}
            <EventMap
              initialLocation={event.coordinates}
              onLocationSelected={() => {}}
              viewOnly
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-6 flex justify-between">
        <div className="flex gap-4 text-gray-700 items-center">
          <div className="flex items-center gap-1">
            <Users className="h-5 w-5" />
            <span>{event.attendees} attending</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            <span>{event.rating}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EventInformation;
