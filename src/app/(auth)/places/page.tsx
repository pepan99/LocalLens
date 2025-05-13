import { PlacesHeader } from "@/components/places/places-header";
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
  const category = searchParam.category;
  const sort = searchParam.sort;

  // Fetch data based on search parameters
  let places = [];

  if (search) {
    places = await searchPlaces(search);
  } else {
    places = await getPlaces();
  }

  // Get categories for filter options
  const categories = await getPlaceCategories();

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white/90 backdrop-blur-sm flex flex-col gap-4 rounded-lg shadow-md p-6">
        <PlacesHeader />

        <Suspense
          fallback={<div className="py-4 text-center">Loading places...</div>}
        >
          <ClientPlaces
            initialPlaces={places}
            categories={categories}
            initialSearch={search || ""}
            initialCategory={category || "All Categories"}
            initialSort={sort || "distance"}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default PlacesPage;
