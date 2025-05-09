"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { Event } from "../utils";
import { formatEventDate, formatEventTime } from "./utils";

interface EventHeaderProps {
  event: Event;
}

const EventHeader = ({ event }: EventHeaderProps) => {
  return (
    <div className="mb-6">
      <Button variant="outline" asChild className="mb-4">
        <Link href="/events">
          <span className="mr-2">←</span> Back to Events
        </Link>
      </Button>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{event.title}</h1>
          <div className="text-lg mt-2 text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatEventDate(event.date)}
            </span>
            <span className="flex items-center gap-1 mt-1">
              <Clock className="h-4 w-4" />
              {formatEventTime(event.date)}
            </span>
          </div>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1">
          {event.category}
        </Badge>
      </div>
    </div>
  );
};

export default EventHeader;
