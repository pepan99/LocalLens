import { Badge } from "@/components/ui/badge";
import { EventType } from "@/modules/events/types/events";
import { Calendar } from "lucide-react";

type PlaceCardEventInfoProps = {
  events: EventType[] | null;
};

export const PlaceCardEventInfo = ({ events }: PlaceCardEventInfoProps) => {
  if (!events) {
    return <span className="text-gray-500 text-sm">Loading events...</span>;
  }

  if (events.length > 0) {
    return (
      <Badge variant="outline" className="flex items-center">
        <Calendar className="h-3 w-3 mr-1" />
        {events.length} {events.length === 1 ? "event" : "events"}
      </Badge>
    );
  }

  // Render nothing or a placeholder if there are no events
  return <span className="text-gray-500 text-sm">No upcoming events</span>;
};
