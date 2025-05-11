import { getEventById } from "@/modules/events/server/queries";
import { notFound } from "next/navigation";
import ClientEventDetailPage from "./client-event-detail";

type Props = {
  params: { id: string };
};

export const EventDetailPage = async ({ params }: Props) => {
  const eventId = params.id;
  const event = await getEventById(eventId);

  if (!event) {
    notFound();
  }

  return <ClientEventDetailPage initialEvent={event} />;
};

export default EventDetailPage;
