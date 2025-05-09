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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  ChevronDown,
  Clock,
  Edit,
  Filter,
  ListFilter,
  MapPin,
  Star,
  Trash,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock data for events
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
    isOwner: true,
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
    isOwner: false,
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
    isOwner: false,
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
    isOwner: true,
  },
  {
    id: "5",
    title: "Jazz Night",
    category: "Music",
    date: "2025-05-12T20:00:00",
    location: "Music Lab, Brno",
    coordinates: [49.198, 16.607],
    attendees: 56,
    rating: 4.7,
    isOwner: false,
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

// Sort events by date
const sortEvents = (events: typeof MOCK_EVENTS, sortBy: string) => {
  switch (sortBy) {
    case "date-asc":
      return [...events].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
    case "date-desc":
      return [...events].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    case "rating":
      return [...events].sort((a, b) => b.rating - a.rating);
    case "popularity":
      return [...events].sort((a, b) => b.attendees - a.attendees);
    default:
      return events;
  }
};

const EventsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("date-asc");
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Filter events based on search query and category
  const filteredEvents = events.filter(event => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort filtered events
  const sortedEvents = sortEvents(filteredEvents, sortBy);

  // Delete event handler
  const handleDeleteEvent = () => {
    if (deleteEventId) {
      setEvents(events.filter(event => event.id !== deleteEventId));
      setDeleteEventId(null);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              Events
            </h1>
            <p className="text-gray-500 mt-1">
              Browse, manage, and create events
            </p>
          </div>
          <Button asChild>
            <Link href="/events/create">Create New Event</Link>
          </Button>
        </div>

        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search events by title or location..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-400"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
            </div>

            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    {selectedCategory || "All Categories"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSelectedCategory(null)}>
                    All Categories
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSelectedCategory("Technology")}
                  >
                    Technology
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedCategory("Food")}>
                    Food & Drink
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedCategory("Arts")}>
                    Arts & Culture
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSelectedCategory("Sports")}
                  >
                    Sports & Fitness
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSelectedCategory("Music")}
                  >
                    Music
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <ListFilter className="h-4 w-4" />
                    Sort By
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Sort Events</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSortBy("date-asc")}>
                    Date (Ascending)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("date-desc")}>
                    Date (Descending)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("rating")}>
                    Highest Rated
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("popularity")}>
                    Most Popular
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {selectedCategory && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Active filters:</span>
              <Badge variant="secondary" className="flex items-center gap-1">
                {selectedCategory}
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="ml-1 hover:text-gray-900 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </Badge>
            </div>
          )}
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="attending">Attending</TabsTrigger>
            <TabsTrigger value="my-events">My Events</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {sortedEvents.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">No events found</h3>
                <p className="mt-1 text-gray-500">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedEvents.map(event => (
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
                        <span>{formatEventDate(event.date)}</span>
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
                        {event.isOwner ? (
                          <>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/events/${event.id}/edit`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setDeleteEventId(event.id);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash className="h-4 w-4 text-red-500" />
                            </Button>
                          </>
                        ) : (
                          <Button size="sm" variant="default">
                            RSVP
                          </Button>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="attending">
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">
                Events You&apos;re Attending
              </h3>
              <p className="mt-1 text-gray-500">
                RSVP to events to see them here
              </p>
            </div>
          </TabsContent>

          <TabsContent value="my-events">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedEvents
                .filter(event => event.isOwner)
                .map(event => (
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
                        <span>{formatEventDate(event.date)}</span>
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
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/events/${event.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setDeleteEventId(event.id);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this event? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteEvent}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventsPage;
