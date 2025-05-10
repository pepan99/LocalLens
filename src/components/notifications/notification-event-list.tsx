"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { format, isToday } from "date-fns";
import { useState } from "react";
import { EventDetail } from "../events/event-detail/utils";

interface NotificationProps {
  events: EventDetail[];
}

const NotificationEventList = ({ events }: NotificationProps) => {
  const [hideTodayEvents, setHideTodayEvents] = useState(false);

  const filteredEvents = hideTodayEvents
    ? events.filter(event => !isToday(new Date(event.date)))
    : events;

  if (filteredEvents.length === 0) {
    return (
      <div className="flex justify-between items-center mb-4">
        <p className="text-muted-foreground">
          {events.length !== 0
            ? "No upcoming events except for today."
            : "No upcoming events."}
        </p>
        {events.length !== 0 && (
          <div className="flex items-center space-x-2">
            <Label>Hide today events</Label>
            <Checkbox
              checked={hideTodayEvents}
              onCheckedChange={value => setHideTodayEvents(!!value)}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Your Event Notifications</h2>
        <div className="flex items-center space-x-2">
          <Label>Hide today events</Label>
          <Checkbox
            checked={hideTodayEvents}
            onCheckedChange={value => setHideTodayEvents(!!value)}
          />
        </div>
      </div>

      {filteredEvents.map(event => {
        const active = isToday(new Date(event.date));
        return (
          <Card key={event.id} className="my-4 relative">
            {active && (
              <Badge className="absolute top-4 right-4" variant="destructive">
                Today
              </Badge>
            )}
            <CardContent className="px-6 py-4 space-y-1">
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <p className="text-sm text-muted-foreground">
                {format(new Date(event.date), "PPpp")} — {event.location}
              </p>
              <p className="text-sm">{event.description}</p>
              <p className="text-sm text-muted-foreground">
                {event.attendees} attending
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default NotificationEventList;
