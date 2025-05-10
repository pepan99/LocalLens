"use client";

import {
  DeleteEventDialog,
  EventCard,
  EventFilters,
} from "@/components/events/components";
import { MOCK_EVENTS, sortEvents } from "@/components/events/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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

  // Handle delete button click
  const handleDeleteClick = (eventId: string) => {
    setDeleteEventId(eventId);
    setIsDeleteDialogOpen(true);
  };

  // Handle dialog close
  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeleteEventId(null);
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

        {/* Filters Component */}
        <EventFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="attending">Attending</TabsTrigger>
            <TabsTrigger value="my-events">My Events</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[570]">
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
                    <EventCard
                      key={event.id}
                      event={event}
                      onDelete={handleDeleteClick}
                    />
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
                    <EventCard
                      key={event.id}
                      event={event}
                      onDelete={handleDeleteClick}
                    />
                  ))}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteEventDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
};

export default EventsPage;
