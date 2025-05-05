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
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Filter, MapPin, Star, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock data for now
const MOCK_EVENTS = [
  {
    id: "1",
    title: "Tech Meetup in Brno",
    category: "Technology",
    date: "2025-05-10T18:00:00",
    location: "Impact Hub, Brno",
    coordinates: [49.19, 16.61],
    attendees: 24,
    rating: 4.5,
  },
  {
    id: "2",
    title: "Weekend Farmers Market",
    category: "Food",
    date: "2025-05-09T09:00:00",
    location: "Freedom Square, Brno",
    coordinates: [49.2, 16.6],
    attendees: 120,
    rating: 4.8,
  },
  {
    id: "3",
    title: "Art Exhibition Opening",
    category: "Arts",
    date: "2025-05-15T17:00:00",
    location: "Moravian Gallery, Brno",
    coordinates: [49.195, 16.605],
    attendees: 45,
    rating: 4.3,
  },
  {
    id: "4",
    title: "Weekly Running Club",
    category: "Sports",
    date: "2025-05-07T19:00:00",
    location: "Lužánky Park, Brno",
    coordinates: [49.205, 16.615],
    attendees: 18,
    rating: 4.6,
  },
];

// Format date to be more readable
const formatEventDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const EventsSidebar = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);

  const handleEventClick = (eventId: string, coordinates: [number, number]) => {
    setSelectedEvent(eventId);
    setMapCenter(coordinates);
    // In a full implementation, this would update the map markers or center
  };

  return (
    <div className="h-full flex flex-col">
      {/* Semi-transparent sidebar that overlays part of the map */}
      <div className="w-96 h-full bg-white/85 backdrop-blur-sm shadow-lg border-r border-gray-200 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Discover Events
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterOpen(true)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        <Tabs defaultValue="upcoming">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="nearby">Nearby</TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {MOCK_EVENTS.map(event => (
              <Card
                key={event.id}
                className={`cursor-pointer transition hover:shadow-md ${
                  selectedEvent === event.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => handleEventClick(event.id, event.coordinates)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <Badge variant="outline">{event.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{formatEventDate(event.date)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{event.location}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex justify-between border-t border-gray-100 pt-2">
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{event.attendees} attending</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
                    <span>{event.rating}</span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="nearby">
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <MapPin className="h-12 w-12 mb-2 text-gray-400" />
              <p>Finding events near your location...</p>
            </div>
          </TabsContent>

          <TabsContent value="friends">
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Users className="h-12 w-12 mb-2 text-gray-400" />
              <p>Connect with friends to see their events</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/dashboard/friends">Manage Friends</Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Filter sheet */}
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Filter Events</SheetTitle>
            <SheetDescription>
              Narrow down events based on your preferences
            </SheetDescription>
          </SheetHeader>
          <div className="py-4 space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Technology",
                  "Food",
                  "Arts",
                  "Sports",
                  "Music",
                  "Education",
                  "Social",
                ].map(category => (
                  <Badge
                    key={category}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary/10"
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-2">Date Range</h3>
              {/* Date picker would go here */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Today
                </Button>
                <Button variant="outline" size="sm">
                  This Week
                </Button>
                <Button variant="outline" size="sm">
                  This Month
                </Button>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-2">Distance</h3>
              {/* Distance slider would go here */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  1 km
                </Button>
                <Button variant="outline" size="sm">
                  5 km
                </Button>
                <Button variant="outline" size="sm">
                  10 km
                </Button>
              </div>
            </div>

            <div className="pt-4 flex gap-2">
              <Button className="flex-1">Apply Filters</Button>
              <Button variant="outline">Reset</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default EventsSidebar;
