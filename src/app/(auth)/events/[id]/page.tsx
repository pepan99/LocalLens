import { getEventById } from "@/modules/events/server/queries";
import { getAttendingUsers } from "@/modules/events/server/rsvp";
import { notFound } from "next/navigation";
import ClientEventDetailPage from "./client-event-detail";

type Props = {
  params: { id: string };
};

export const EventDetailPage = async ({ params }: Props) => {
  const eventId = await params.id;
  const event = await getEventById(eventId);
  const attendees = await getAttendingUsers(eventId);

  if (!event) {
    notFound();
  }

  return <ClientEventDetailPage initialEvent={event} attendees={attendees} />;
};

export default EventDetailPage;
