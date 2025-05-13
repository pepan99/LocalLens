import { auth } from "@/auth";
import { getPublicEvents } from "@/modules/events/server/public-queries";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import ClientSideDiscoverPage from "./client-discover";

export const metadata: Metadata = {
  title: "Discover Events | LocalLens",
  description: "Discover public events happening around you with LocalLens",
  openGraph: {
    title: "Discover Events | LocalLens",
    description: "Discover public events happening around you with LocalLens",
    type: "website",
  },
};

const DiscoverPage = async () => {
  const session = await auth();

  if (session?.user) {
    redirect("/map");
  }

  const events = await getPublicEvents();

  return <ClientSideDiscoverPage events={events} />;
};

export default DiscoverPage;
