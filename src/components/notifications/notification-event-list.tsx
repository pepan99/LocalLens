"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { markEventInvitationAsDeleted } from "@/modules/invitations/actions/invitations";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { EventInvitationNotification } from "./utils";

interface NotificationProps {
  events: EventInvitationNotification[];
}

const NotificationEventList = ({ events }: NotificationProps) => {
  const router = useRouter();

  const handleDelete = async (eventId: string) => {
    await markEventInvitationAsDeleted(eventId);

    router.refresh();
  };

  if (events.length === 0) {
    return (
      <div className="flex justify-between items-center mb-4">
        <p className="text-muted-foreground">No notification was found.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-md text-muted-foreground">
          Your event invitations
        </h2>
      </div>

      {events.map(event => {
        return (
          <Link href={`/events/${event.id}`} key={event.id}>
            <Card className="my-4 relative hover:shadow-lg transition-shadow cursor-pointer">
              {!event.seen && (
                <Badge className="absolute top-4 right-4" variant="destructive">
                  New
                </Badge>
              )}
              <CardContent className="px-6 py-2 space-y-1">
                <h2 className="text-xl font-semibold">{event.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(event.date), "PPpp")} — {event.location}
                </p>
                <p className="text-sm">{event.description}</p>
                <p className="text-sm text-muted-foreground">
                  {event.attendees} invited
                </p>
              </CardContent>
              <Button
                onClick={e => {
                  e.preventDefault();
                  handleDelete(event.id);
                }}
                className="absolute bottom-4 right-4"
                title="Delete notification"
              >
                <Trash2 size={16} />
              </Button>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};

export default NotificationEventList;
