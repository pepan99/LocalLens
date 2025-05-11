import { CreateEventForm } from "@/components/events/event-create";
import { getEventById } from "@/modules/events/server/queries";
import { notFound } from "next/navigation";

type EditEventPageProps = {
  params: {
    id: string;
  };
};

const EditEventPage = async ({ params }: EditEventPageProps) => {
  const eventId = (await params).id;
  const event = await getEventById(eventId);

  if (!event) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <CreateEventForm event={event} />
    </div>
  );
};

export default EditEventPage;
