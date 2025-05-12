import { getEvents, getUserEvents } from "@/modules/events/server/queries";
import ClientSideEventsPage from "./client-events";

const EventsPage = async () => {
  // Fetch events from the server
  const events = await getEvents(50); // Get up to 50 events
  const userEvents = await getUserEvents(); // Get events created by the user

  return (
    <ClientSideEventsPage initialEvents={events} userEvents={userEvents} />
  );
};

export default EventsPage;
