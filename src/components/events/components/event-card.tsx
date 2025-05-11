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
import { EventType } from "@/modules/events/types/events";
import { Clock, Edit, MapPin, Star, Trash, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { RSVPManager, RSVPStatusEnum } from "../rsvp";
import { formatEventDate } from "../utils";

interface EventCardProps {
  event: EventType;

  onDelete: (eventId: string) => void;
  onRSVPChange?: (eventId: string, status: RSVPStatusEnum) => void;
}

const EventCard = ({ event, onDelete, onRSVPChange }: EventCardProps) => {
  const session = useSession();
  return (
    <Card key={event.id} className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{event.title}</CardTitle>
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
          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 mr-1" />
            <span>{event.attendees}</span>
          </div>
          <div className="flex items-center text-sm">
            <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
            <span>{event.rating}</span>
          </div>
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
