"use client";

import {
  calculateDistance,
  useLocation,
} from "@/components/map/location_provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EventType, RSVPStatusEnum } from "@/modules/events/types/events";
import { Clock, Edit, MapPin, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useMemo } from "react";
import { RSVPManager } from "../rsvp";
import { formatEventDate } from "../utils";

interface EventCardProps {
  event: EventType;

  onDelete: (eventId: string) => void;
  onRSVPChange?: (eventId: string, status: RSVPStatusEnum) => void;
}

const EventCard = ({ event, onDelete, onRSVPChange }: EventCardProps) => {
  const session = useSession();

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
    <Card key={event.id} className="min-w-[300]">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg truncate max-w-[200]">
            {event.title}
          </CardTitle>
          <Badge variant="outline">{event.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex items-center text-sm text-gray-500 mb-1">
          <Clock className="h-4 w-4 mr-1" />
          <span>{formatEventDate(event.date.toDateString())}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{event.location}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-gray-50 px-4 py-3">
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
        <div className="flex gap-2">
          {event.creatorId === session.data?.user.id ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/events/${event.id}`}>View</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/events/${event.id}/edit`}>
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(event.id)}
              >
                <Trash className="h-4 w-4 text-red-500" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/events/${event.id}`}>View</Link>
              </Button>
              <RSVPManager
                event={event}
                eventTitle={event.title}
                buttonVariant="default"
                buttonSize="sm"
                onRSVPChange={onRSVPChange}
              />
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
