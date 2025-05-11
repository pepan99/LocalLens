import { getEvents, getUserEvents } from "@/modules/events/server/queries";
import { Metadata } from "next";
import ClientSideEventsPage from "./client-events";

export const metadata: Metadata = {
  title: "Events | LocalLens",
  description: "View, filter, and manage events on LocalLens",
};

export const EventsPage = async () => {
  // Fetch events from the server
  const events = await getEvents(50); // Get up to 50 events
  const userEvents = await getUserEvents(); // Get events created by the user

  return (
    <ClientSideEventsPage initialEvents={events} userEvents={userEvents} />
  );
};

export default EventsPage;
