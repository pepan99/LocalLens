import { getEvents } from "@/modules/events/server/queries";
import ExploreEvents from "./client-explore-detail";

const ExploreEventsPage = async () => {
  const events = await getEvents();

  return (
    <div className="bg-gradient-to-br from-white to-indigo-100/95 rounded-lg shadow-lg min-w-[400] p-4 md:p-6 w-full max-w-md lg:max-w-sm h-[calc(100dvh-10rem)] max-h-[85vh] overflow-hidden flex flex-col space-y-4 ">
      <ExploreEvents sourceEvents={events} />
    </div>
  );
};

export default ExploreEventsPage;
