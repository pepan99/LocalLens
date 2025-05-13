import { getEvents } from "@/modules/events/server/queries";
import ClientSideEventsPage from "./client-events";

const EventsPage = async () => {
  // Fetch events from the server
  const events = await getEvents();

  return <ClientSideEventsPage events={events} />;
};

export default EventsPage;
