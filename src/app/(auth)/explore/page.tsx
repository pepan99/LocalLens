import { getEvents } from "@/modules/events/server/queries";
import ExploreEvents from "./client-explore-detail";

const ExploreEventsPage = async () => {
  const events = await getEvents();

  return <ExploreEvents sourceEvents={events} />;
};

export default ExploreEventsPage;
