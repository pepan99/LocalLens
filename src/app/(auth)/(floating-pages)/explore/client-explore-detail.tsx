"use client";

import {
  EventsList,
  filterEvents,
  FilterMenu,
  FilterOptions,
  FilterTab,
  FilterTabs,
} from "@/components/explore";
import {
  calculateDistance,
  useLocation,
} from "@/components/map/location_provider";
import { EventType, RSVPStatusEnum } from "@/modules/events/types/events";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type ExploreEventsProps = {
  sourceEvents: EventType[];
};

const ExploreEvents = ({ sourceEvents }: ExploreEventsProps) => {
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    maxDistance: 0,
    categories: [],
  });

  // Get the user's current location
  const userLocation = useLocation();

  // Apply both tab filtering and custom filters
  const filteredEvents = useMemo(() => {
    // First filter by tab (All, Today, This Week)
    let events = filterEvents(sourceEvents, activeTab);

    // Then apply distance filter if we have user location
    if (filters.maxDistance > 0 && userLocation.position !== null) {
      events = events.filter(event => {
        // Calculate distance between user and event
        const distance = calculateDistance(
          userLocation.position![0],
          userLocation.position![1],
          event.latitude,
          event.longitude,
        );

        // Return events within the specified max distance
        return distance <= filters.maxDistance;
      });
    }

    // Then apply category filter
    if (filters.categories.length > 0) {
      events = events.filter(event =>
        filters.categories.includes(event.category),
      );
    }

    return events;
  }, [
    activeTab,
    filters.categories,
    filters.maxDistance,
    sourceEvents,
    userLocation,
  ]);

  const handleTabChange = (tab: FilterTab) => {
    setActiveTab(tab);
  };

  // Filter menu is now controlled via the dropdown component

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);

    // Check if we have location and display appropriate toast message
    if (newFilters.maxDistance > 0) {
      if (userLocation.loading) {
        toast.warning(
          "Getting your location... All events will be shown until location is available.",
        );
      } else if (userLocation.error) {
        toast.error(
          "Location not available. Distance filter will be applied when location access is granted.",
        );
      } else if (userLocation.position === null) {
        toast.warning(
          "Waiting for location. All events will be shown until location is available.",
        );
      } else {
        toast.success(
          `Showing events within ${newFilters.maxDistance}km${newFilters.categories.length > 0 ? ` in categories: ${newFilters.categories.join(", ")}` : ""}`,
        );
      }
    } else {
      toast(
        `Filter applied${newFilters.categories.length > 0 ? ` for categories: ${newFilters.categories.join(", ")}` : ""}`,
      );
    }
  };

  const handleRSVPChange = (eventId: string, status: RSVPStatusEnum) => {
    // Find the event
    const event = sourceEvents.find(e => e.id.toString() === eventId);

    if (event) {
      const message =
        status === RSVPStatusEnum.GOING
          ? `You're going to ${event.title}!`
          : status === RSVPStatusEnum.MAYBE
            ? `You might attend ${event.title}.`
            : `You've declined ${event.title}.`;

      toast(message);
    }
  };

  return (
    <>
      {/* Header Section with integrated filter dropdown */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
          Events Near You
        </h2>
        <FilterMenu
          isOpen={filterMenuOpen}
          onClose={() => setFilterMenuOpen(false)}
          onApplyFilters={handleApplyFilters}
          locationStatus={{
            loading: userLocation.loading,
            error: userLocation.error,
            available: userLocation.position !== null,
          }}
        />
      </div>

      {/* Filter Tabs Section with counter */}
      <div className="flex flex-col mb-4">
        <FilterTabs activeTab={activeTab} onTabChange={handleTabChange} />
        <div className="text-sm text-gray-500 mt-1">
          {filteredEvents.length}{" "}
          {filteredEvents.length === 1 ? "event" : "events"} found
        </div>
      </div>

      {/* Events List */}
      <EventsList
        events={filteredEvents}
        onRSVPChange={handleRSVPChange}
        activeTab={activeTab}
      />
    </>
  );
};

export default ExploreEvents;
