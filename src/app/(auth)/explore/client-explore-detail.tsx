"use client";

import {
  EventsList,
  ExploreHeader,
  filterEvents,
  FilterMenu,
  FilterOptions,
  FilterTab,
  FilterTabs,
} from "@/components/explore";
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
    maxDistance: 5,
    categories: [],
  });

  // Apply both tab filtering and custom filters
  const filteredEvents = useMemo(() => {
    // First filter by tab (All, Today, This Week)
    let events = filterEvents(sourceEvents, activeTab);

    // Then apply custom filters
    if (filters.maxDistance > 0) {
      console.log("You need to provide your location to filter by distance.");
    }

    if (filters.categories.length > 0) {
      events = events.filter(event =>
        filters.categories.includes(event.category),
      );
    }

    return events;
  }, [activeTab, filters.categories, filters.maxDistance, sourceEvents]);

  const handleTabChange = (tab: FilterTab) => {
    setActiveTab(tab);
  };

  const handleFilterClick = () => {
    setFilterMenuOpen(true);
  };

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    toast(
      `Showing events within ${newFilters.maxDistance}km${newFilters.categories.length > 0 ? ` in categories: ${newFilters.categories.join(", ")}` : ""}`,
    );
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
      {/* Header Section */}
      <ExploreHeader onFilterClick={handleFilterClick} />

      {/* Filter Tabs Section */}
      <FilterTabs activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Events List */}
      <EventsList
        events={filteredEvents}
        onRSVPChange={handleRSVPChange}
        activeTab={activeTab}
      />

      {/* Filter Menu Sheet */}
      <FilterMenu
        isOpen={filterMenuOpen}
        onClose={() => setFilterMenuOpen(false)}
        onApplyFilters={handleApplyFilters}
      />
    </>
  );
};

export default ExploreEvents;
