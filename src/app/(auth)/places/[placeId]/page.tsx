import { Skeleton } from "@/components/ui/skeleton";
import { getPlaceWithReviews } from "@/modules/places";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ClientPlaceDetail from "./client-place-detail";

export const dynamic = "force-dynamic";

type DetailPageParams = {
  params: Promise<{
    placeId: string;
  }>;
  searchParams: Promise<{
    tab?: string;
  }>;
};

const PlaceDetailPage = async ({ params, searchParams }: DetailPageParams) => {
  const param = await params;
  const searchParam = await searchParams;
  // Get the placeId from params
  const placeId = param.placeId;

  // Get the active tab from search params
  const activeTab = searchParam.tab || "about";

  // Get place data with reviews
  const placeWithReviews = await getPlaceWithReviews(placeId);

  // If place doesn't exist, show 404
  if (!placeWithReviews) {
    notFound();
  }

  // Separate place data and reviews for passing to client component
  const { reviews, ...place } = placeWithReviews;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md">
        <Suspense
          fallback={
            <div className="p-6 space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          }
        >
          <ClientPlaceDetail
            place={place}
            initialReviews={reviews || []}
            placeId={placeId}
            initialTab={activeTab}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default PlaceDetailPage;
