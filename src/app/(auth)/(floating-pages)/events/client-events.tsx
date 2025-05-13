"use client";

import {
  DeleteEventDialog,
  EventCard,
  EventFilters,
} from "@/components/events/components";
import { sortEvents } from "@/components/events/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { deleteEvent } from "@/modules/events/actions/events";
import { EventType } from "@/modules/events/types/events";
import { Calendar } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useMemo, useState } from "react";
import { toast } from "sonner";

interface ClientSideEventsPageProps {
  events: EventType[];
}

const ClientSideEventsPage = ({ events }: ClientSideEventsPageProps) => {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("date-asc");
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const session = useSession();

  // Filter events based on search query and category
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        !selectedCategory || event.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [events, searchQuery, selectedCategory]);

  // Sort filtered events
  const sortedEvents = useMemo(() => {
    return sortEvents(filteredEvents, sortBy);
  }, [filteredEvents, sortBy]);

  const myEvents = useMemo(() => {
    return events.filter(event => event.creatorId === session.data?.user.id);
  }, [events, session.data?.user.id]);

  // Get user's own events
  const filteredUserEvents = useMemo(() => {
    return myEvents.filter(event => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        !selectedCategory || event.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [myEvents, searchQuery, selectedCategory]);

  const sortedUserEvents = useMemo(() => {
    return sortEvents(filteredUserEvents, sortBy);
  }, [filteredUserEvents, sortBy]);

  // Delete event handler
  const handleDeleteEvent = async () => {
    if (deleteEventId) {
      try {
        // Call the server action to delete the event
        const result = await deleteEvent(deleteEventId);

        if (result.type === "success") {
          // Update local state
          toast.success("Event deleted successfully");
        } else {
          toast.error(result.message || "Failed to delete the event");
        }

        setDeleteEventId(null);
        setIsDeleteDialogOpen(false);

        // Refresh the page data
        router.refresh();
      } catch (error) {
        console.error("Error deleting event:", error);
        toast.error("An error occurred while deleting the event");
        setIsDeleteDialogOpen(false);
        setDeleteEventId(null);
      }
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
    <div className="container">
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
            <TabsTrigger value="my-events">My Events</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[570px]">
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

            <TabsContent value="my-events">
              {sortedUserEvents.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">
                    You haven&apos;t created any events yet
                  </h3>
                  <p className="mt-1 text-gray-500">
                    Create a new event to see it here
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedUserEvents.map(event => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onDelete={handleDeleteClick}
                      onRSVPChange={(id, status) => {
                        event.rsvp = { status: status, guests: 0, note: "" };
                      }}
                    />
                  ))}
                </div>
              )}
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

export default ClientSideEventsPage;
