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
import { Calendar, Clock, LogIn, MapPin, Share, User } from "lucide-react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type PublicEventDetailPageProps = {
  event: EventType;
};

const PublicEventDetailPage = ({ event }: PublicEventDetailPageProps) => {
  const { data: session } = useSession();
  const router = useRouter();

  // Load Map component dynamically to avoid SSR issues
  const EventMap = dynamic(
    () => import("@/components/public/public-events-map"),
    {
      ssr: false,
    },
  );

  const handleShare = () => {
    // Share event functionality
    if (navigator.share) {
      navigator
        .share({
          title: event.title,
          text: `Check out this event: ${event.title}`,
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

  const handleLoginToRSVP = () => {
    router.push(`/login?callbackUrl=/events/${event.id}`);
  };

  return (
    <div className="container">
      <div className="mb-6">
        <Button variant="outline" asChild className="mb-4">
          <Link href="/discover">
            <span className="mr-2">←</span> Back to Discover
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event Information */}
        <div className="lg:col-span-2">
          <Card className="">
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
                  <span className="flex items-center gap-1 mt-1">
                    <User className="h-4 w-4" />
                    {event.attendees} people are going
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
                  <EventMap events={[event]} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Event Actions */}
        <div>
          <Card className="">
            <CardHeader>
              <CardTitle>Event Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {session ? (
                <Button className="w-full" asChild>
                  <Link href={`/events/${event.id}`}>
                    View Full Event Details
                  </Link>
                </Button>
              ) : (
                <Button className="w-full" onClick={handleLoginToRSVP}>
                  <LogIn className="mr-2 h-4 w-4" /> Login to RSVP
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full"
                onClick={handleShare}
              >
                <Share className="mr-2 h-4 w-4" /> Share Event
              </Button>
            </CardContent>
            <CardFooter className="flex-col items-start">
              <div className="text-sm text-gray-500 space-y-2">
                <p>
                  <span className="font-medium">Capacity:</span>{" "}
                  {event.capacity} attendees
                </p>
                <p>
                  <span className="font-medium">Visibility:</span> Public Event
                </p>
              </div>
            </CardFooter>
          </Card>

          {/* Join Community Card */}
          <Card className="mt-6 ">
            <CardHeader>
              <CardTitle>Join LocalLens</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-700">
                Create your own events, RSVP to this one, and connect with
                attendees by signing up for LocalLens.
              </p>
              {!session && (
                <div className="flex gap-2 mt-4">
                  <Button className="flex-1" asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PublicEventDetailPage;
