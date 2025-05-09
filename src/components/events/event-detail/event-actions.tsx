"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Edit, Share, Trash } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { RSVPManager, RSVPStatusEnum } from "../rsvp";
import { EventDetail } from "./utils";

interface EventActionsProps {
  event: EventDetail;
  onDelete: () => void;
  onRSVPChange?: (eventId: string, status: RSVPStatusEnum) => void;
}

const EventActions = ({ event, onDelete, onRSVPChange }: EventActionsProps) => {
  const handleShare = () => {
    // In a real app, this would open a sharing dialog
    if (navigator.share) {
      navigator
        .share({
          title: event?.title,
          text: `Check out this event: ${event?.title}`,
          url: window.location.href,
        })
        .catch(err => {
          console.error("Could not share:", err);
        });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.info("Event link copied to clipboard!");
    }
  };

  // Handler for RSVP changes
  const handleRSVPChange = (eventId: string, status: RSVPStatusEnum) => {
    if (onRSVPChange) {
      onRSVPChange(eventId, status);
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Event Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {event.isOwner ? (
          <>
            <Button className="w-full" asChild>
              <Link href={`/events/${event.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" /> Edit Event
              </Link>
            </Button>
            <Button variant="destructive" className="w-full" onClick={onDelete}>
              <Trash className="mr-2 h-4 w-4" /> Delete Event
            </Button>
          </>
        ) : (
          <RSVPManager
            eventId={event.id}
            eventTitle={event.title}
            buttonVariant="default"
            buttonSize="default"
            buttonClassName="w-full"
            onRSVPChange={handleRSVPChange}
          />
        )}
        <Button variant="outline" className="w-full" onClick={handleShare}>
          <Share className="mr-2 h-4 w-4" /> Share Event
        </Button>
      </CardContent>
      <CardFooter className="flex-col items-start">
        <div className="text-sm text-gray-500 space-y-2">
          <p>
            <span className="font-medium">Capacity:</span> {event.capacity}{" "}
            attendees
          </p>
          <p>
            <span className="font-medium">Visibility:</span>{" "}
            {event.isPrivate ? "Private Event" : "Public Event"}
          </p>
          <p>
            <span className="font-medium">Created by:</span>{" "}
            {event.isOwner ? "You" : "Event Organizer"}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EventActions;
