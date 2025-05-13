import { CreateEventForm } from "@/components/events/event-create";
import { getPlaces } from "@/modules/places";

const CreateEventPage = async () => {
  const places = await getPlaces();

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <CreateEventForm places={places} />
    </div>
  );
};

export default CreateEventPage;
