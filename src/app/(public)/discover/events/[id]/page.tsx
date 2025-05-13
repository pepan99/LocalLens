import { auth } from "@/auth";
import { getPublicEventById } from "@/modules/events/server/public-queries";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import PublicEventDetailPage from "./public-event-detail";

type Props = {
  params: Promise<{ id: string }>;
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  // Fetch event data
  const param = await params;
  const eventId = param.id;
  const event = await getPublicEventById(eventId);

  if (!event) {
    return {
      title: "Event Not Found | LocalLens",
      description: "The event you're looking for doesn't exist or is private.",
    };
  }

  return {
    title: `${event.title} | LocalLens`,
    description: event.description.substring(0, 160),
    openGraph: {
      title: event.title,
      description: event.description.substring(0, 160),
      type: "website",
    },
  };
};

const EventPage = async ({ params }: Props) => {
  const session = await auth();
  const param = await params;
  const eventId = param.id;

  // If the user is authenticated, redirect to the authenticated event page
  if (session?.user) {
    redirect(`/events/${eventId}`);
  }

  // Otherwise, load the public event
  const event = await getPublicEventById(eventId);

  if (!event) {
    notFound();
  }

  return <PublicEventDetailPage event={event} />;
};

export default EventPage;
