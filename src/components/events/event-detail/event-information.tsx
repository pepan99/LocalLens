"use client";

import {
  calculateDistance,
  useLocation,
} from "@/components/map/location_provider";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EventType } from "@/modules/events/types/events";
import { Calendar, Clock, MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import { useMemo } from "react";

interface EventInformationProps {
  event: EventType;
}

const EventInformation = ({ event }: EventInformationProps) => {
  // Load Map component dynamically to avoid SSR issues
  const EventMap = useMemo(
    () =>
      dynamic(() => import("@/components/events/location-picker"), {
        ssr: false,
      }),
    [],
  );

  // Get user location
  const { position } = useLocation();

  // Calculate distance between user and event
  const distance = useMemo(() => {
    if (position) {
      return calculateDistance(
        position[0],
        position[1],
        event.latitude,
        event.longitude,
      );
    }
    return null;
  }, [position, event.latitude, event.longitude]);

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
              {event.time}
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
              initialLocation={[event.latitude, event.longitude]}
              onLocationSelected={() => {}}
              viewOnly
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-6 flex justify-between">
        <div className="flex gap-4 text-gray-700 items-center">
          <div className="flex items-center gap-4">
            {distance !== null && (
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                <span>
                  {distance < 1
                    ? `${Math.round(distance * 1000)} m`
                    : `${distance.toFixed(1)} km`}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EventInformation;
