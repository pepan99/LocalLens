import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import Link from "next/link";

type PlaceEventsTabProps = {
  placeId: string;
  upcomingEvents?: number;
};

export const PlaceEventsTab = ({
  placeId,
  upcomingEvents,
}: PlaceEventsTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Upcoming Events</h2>
        <Button variant="outline" asChild>
          <Link href={`/events/create?placeId=${placeId}`}>Create Event</Link>
        </Button>
      </div>

      {upcomingEvents ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          Upcoming events: {upcomingEvents}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">No upcoming events</h3>
          <p className="mt-1 text-gray-500">
            Be the first to create an event at this place
          </p>
          <Button className="mt-4" asChild>
            <Link href={`/events/create?placeId=${placeId}`}>Create Event</Link>
          </Button>
        </div>
      )}
    </div>
  );
};
