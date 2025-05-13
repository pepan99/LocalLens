"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventType } from "@/modules/events/types/events";
import { Calendar, ExternalLink, MapPin } from "lucide-react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";

type ClientSideDiscoverPageProps = {
  events: EventType[];
};

const ClientSideDiscoverPage = ({ events }: ClientSideDiscoverPageProps) => {
  const { data: session } = useSession();

  // Load Map component dynamically to avoid SSR issues
  const PublicEventsMap = dynamic(
    () => import("@/components/public/public-events-map"),
    {
      ssr: false,
    },
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Discover Events</h1>
          <p className="text-muted-foreground">
            Explore public events happening around you
          </p>
        </div>
        {!session ? (
          <Button className="mt-4 md:mt-0" asChild>
            <Link href="/login">Sign in to create events</Link>
          </Button>
        ) : (
          <Button className="mt-4 md:mt-0" asChild>
            <Link href="/events">Go to My Events</Link>
          </Button>
        )}
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Events Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] rounded-md overflow-hidden border">
            <PublicEventsMap events={events} />
          </div>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length > 0 ? (
          events.map(event => (
            <Card key={event.id} className="h-full flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                  <Badge variant="outline">{event.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow">
                <div className="mb-4 text-muted-foreground">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(event.date).toLocaleDateString()}, {event.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
                <p className="line-clamp-2 mb-4 flex-grow">
                  {event.description}
                </p>
                <Link
                  href={`/discover/events/${event.id}`}
                  className="text-primary flex items-center mt-auto"
                >
                  View details <ExternalLink className="h-4 w-4 ml-1" />
                </Link>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">No events found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientSideDiscoverPage;
