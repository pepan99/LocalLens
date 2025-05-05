"use client";

import { Button } from "@/components/ui/button";
// Mark as a Client Component for state and interactivity
import {
  Calendar,
  ChevronDown,
  Filter,
  MapPin,
  Star,
  Users,
} from "lucide-react";
import React, { useMemo, useState } from "react";

// Define a type for the event data
type Event = {
  id: number;
  name: string;
  category: string;
  date: string; // Format: "Day, Mon DayNum" (e.g., "Fri, May 9"). Consider using Date objects or ISO strings for robust filtering.
  time: string;
  location: string;
  attendees: number;
  rating: number;
  distance: number; // in km
};

// Mock data for events (replace with actual API data)
// Added more dates for better filtering demo
const mockEvents: Event[] = [
  {
    id: 1,
    name: "Weekend Farmers Market",
    category: "Food",
    date: "Fri, May 9", // Assumed current year
    time: "09:00 AM",
    location: "Freedom Square, Brno",
    attendees: 120,
    rating: 4.8,
    distance: 0.3,
  },
  {
    id: 2,
    name: "Art Exhibition Opening",
    category: "Arts",
    date: "Thu, May 15", // Assumed current year
    time: "05:00 PM",
    location: "Moravian Gallery, Brno",
    attendees: 45,
    rating: 4.3,
    distance: 0.5,
  },
  {
    id: 3,
    name: "Jazz Night",
    category: "Music",
    date: "Mon, May 12", // Assumed current year
    time: "08:00 PM",
    location: "Metro Music Bar, Brno",
    attendees: 63,
    rating: 4.7,
    distance: 0.7,
  },
  {
    id: 4,
    name: "Tech Meetup Brno",
    category: "Tech",
    date: "Tue, May 13", // Assumed current year
    time: "06:30 PM",
    location: "Impact Hub, Brno",
    attendees: 85,
    rating: 4.9,
    distance: 1.1,
  },
  {
    id: 5,
    name: "Book Club Meeting",
    category: "Literature",
    date: "Mon, May 5", // Example for "Today" (assuming today is May 5th)
    time: "07:00 PM",
    location: "Central Library, Brno",
    attendees: 25,
    rating: 4.5,
    distance: 0.9,
  },
];

// Helper function to get today's date string in the format "Mon, May 5"
// NOTE: This is a simplified example. Use a robust date library (like date-fns or dayjs) in a real app.
const getTodayDateString = (): string => {
  const today = new Date();
  // Manually format to match mock data (e.g., "Mon, May 5") - highly fragile!
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
  };
  // Replace comma placement if needed by locale
  return new Intl.DateTimeFormat("en-US", options)
    .format(today)
    .replace(",", "");
};

// Helper function to check if an event is this week (simple example)
// NOTE: This assumes the mock data dates are relevant to the current week.
// A real implementation needs proper date comparison based on week boundaries.
const isThisWeek = (eventDateStr: string): boolean => {
  // Very basic check based on mock data - replace with actual date logic
  const weekDates = [
    "Mon, May 5",
    "Tue, May 6",
    "Wed, May 7",
    "Thu, May 8",
    "Fri, May 9",
    "Sat, May 10",
    "Sun, May 11",
  ]; // Example week
  // Extend this logic based on the actual current week
  const currentWeekMockDates = ["Mon, May 5", "Fri, May 9"]; // Dates from mock data assumed to be this week
  return currentWeekMockDates.some(d => eventDateStr.includes(d));
};

const ExploreEvents: React.FC = () => {
  // State to manage the active filter tab
  const [activeTab, setActiveTab] = useState<"All" | "Today" | "This Week">(
    "All",
  );

  // Placeholder function for handling RSVP clicks
  const handleRsvp = (eventId: number) => {
    console.log(`RSVP clicked for event ${eventId}`);
    // Add actual RSVP logic here
  };

  // Placeholder function for handling Details clicks
  const handleDetails = (eventId: number) => {
    console.log(`Details clicked for event ${eventId}`);
    // Add navigation or modal logic here
  };

  // Memoize filtered events to avoid recalculating on every render
  const filteredEvents = useMemo(() => {
    const todayStr = getTodayDateString(); // Get today's date string (e.g., "Mon, May 5")

    switch (activeTab) {
      case "Today":
        // WARNING: Relies on exact string match including day name - very fragile!
        // Use proper Date object comparison in a real application.
        return mockEvents.filter(event => event.date.includes(todayStr));
      case "This Week":
        // WARNING: Uses a very basic check. Implement proper week calculation.
        return mockEvents.filter(event => isThisWeek(event.date));
      case "All":
      default:
        return mockEvents; // No filtering
    }
  }, [activeTab]); // Recalculate only when activeTab changes

  // --- COLOR SCHEME ---
  // Replace 'indigo' with your actual theme color (e.g., 'purple', 'teal', 'green')
  const themeColor = "indigo";
  const activeTabClasses = `border-b-2 border-${themeColor}-500 text-${themeColor}-600`;
  const inactiveTabClasses = `text-gray-500 hover:text-gray-700`;
  const categoryClasses = `text-xs font-medium text-${themeColor}-700 bg-${themeColor}-100 px-2 py-0.5 rounded`;
  const detailsButtonClasses = `text-sm font-medium text-${themeColor}-600 hover:text-${themeColor}-800 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors`;
  const rsvpButtonClasses = `text-sm font-medium text-white dark:text-black bg-black dark:white hover:bg-${themeColor}-700 px-4 py-1.5 rounded-md transition-colors shadow-sm`;
  // --- END COLOR SCHEME ---

  return (
    // Container for the events list
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 w-full max-w-md lg:max-w-sm h-[calc(100vh-10rem)] max-h-[85vh] overflow-y-auto flex flex-col space-y-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
          Events Near You
        </h2>
        {/* Consider making the filter button functional */}
        <button className="flex items-center text-sm text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md transition-colors">
          <Filter size={16} className="mr-1" />
          Filter
          <ChevronDown size={16} className="ml-1" />
        </button>
      </div>

      {/* Filter Tabs Section */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          onClick={() => setActiveTab("All")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "All" ? activeTabClasses : inactiveTabClasses
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab("Today")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "Today" ? activeTabClasses : inactiveTabClasses
          }`}
        >
          Today
        </button>
        <button
          onClick={() => setActiveTab("This Week")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "This Week" ? activeTabClasses : inactiveTabClasses
          }`}
        >
          This Week
        </button>
      </div>

      {/* Events List - Now uses filteredEvents */}
      <div className="flex-grow space-y-4 overflow-y-auto pr-1">
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <div
              key={event.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
            >
              {/* Event Header */}
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {event.name}
                </h3>
                <span className={categoryClasses}>
                  {" "}
                  {/* Use theme color */}
                  {event.category}
                </span>
              </div>

              {/* Event Details */}
              <div className="space-y-1.5 text-sm text-gray-600 mb-3">
                <div className="flex items-center">
                  <Calendar size={14} className="mr-2 text-gray-500" />
                  <span>
                    {event.date}, {event.time}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin size={14} className="mr-2 text-gray-500" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center">
                  <Users size={14} className="mr-2 text-gray-500" />
                  <span>{event.attendees} attending</span>
                </div>
              </div>

              {/* Rating and Distance */}
              <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  {/* Keep star yellow or adjust if needed */}
                  <Star
                    size={16}
                    className="mr-1 text-yellow-500 fill-current"
                  />
                  <span className="font-medium">{event.rating.toFixed(1)}</span>
                </div>
                <span>{event.distance.toFixed(1)} km</span>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <Button
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => handleDetails(event.id)}
                >
                  Details
                </Button>
                <Button
                  className="cursor-pointer"
                  onClick={() => handleRsvp(event.id)}
                >
                  RSVP
                </Button>
              </div>
            </div>
          ))
        ) : (
          // Optional: Display a message when no events match the filter
          <div className="text-center text-gray-500 py-8">
            No events found for {activeTab}.
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreEvents;
