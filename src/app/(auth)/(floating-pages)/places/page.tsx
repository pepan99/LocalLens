import { PlacesHeader } from "@/components/places/places-header";
import { getEventsForPlace } from "@/modules/events/server/queries";
import { getPlaceCategories, getPlaces, searchPlaces } from "@/modules/places";
import { Suspense } from "react";
import ClientPlaces from "./client-places";

type PlacesPageProps = {
  searchParams: Promise<{
    search?: string;
    category?: string;
    sort?: string;
  }>;
};

const PlacesPage = async ({ searchParams }: PlacesPageProps) => {
  const searchParam = await searchParams;
  const search = searchParam.search;

  // Fetch data based on search parameters
  let places = [];

  if (search) {
    places = await searchPlaces(search);
  } else {
    places = await getPlaces();
  }

  // Get events for all places
  const mappedPlaces = places.map(async place => {
    const events = await getEventsForPlace(place.id);
    return {
      place: place,
      events: events,
    };
  });

  const placesWithEvents = await Promise.all(mappedPlaces);

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gradient-to-br from-white to-purple-100/95 backdrop-blur-sm flex flex-col gap-4 rounded-lg shadow-md p-6">
        <PlacesHeader />

        <ClientPlaces placesWithEvents={placesWithEvents} />
      </div>
    </div>
  );
};

export default PlacesPage;
