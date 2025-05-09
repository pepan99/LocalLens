"use client";

import { RSVPStatusEnum } from "@/components/events/rsvp";
import {
  EventsList,
  ExploreHeader,
  filterEvents,
  FilterMenu,
  FilterOptions,
  FilterTab,
  FilterTabs,
  mockEvents,
} from "@/components/explore";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const ExploreEvents = () => {
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    maxDistance: 5,
    categories: [],
  });

  // Apply both tab filtering and custom filters
  const filteredEvents = useMemo(() => {
    // First filter by tab (All, Today, This Week)
    let events = filterEvents(mockEvents, activeTab);

    // Then apply custom filters
    if (filters.maxDistance > 0) {
      events = events.filter(event => event.distance <= filters.maxDistance);
    }

    if (filters.categories.length > 0) {
      events = events.filter(event =>
        filters.categories.includes(event.category),
      );
    }

    return events;
  }, [activeTab, filters]);

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
    const event = mockEvents.find(e => e.id.toString() === eventId);

    if (event) {
      const message =
        status === RSVPStatusEnum.GOING
          ? `You're going to ${event.name}!`
          : status === RSVPStatusEnum.MAYBE
            ? `You might attend ${event.name}.`
            : `You've declined ${event.name}.`;

      toast(message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 w-full max-w-md lg:max-w-sm h-[calc(100vh-10rem)] max-h-[85vh] overflow-y-auto flex flex-col space-y-4">
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
    </div>
  );
};

export default ExploreEvents;
