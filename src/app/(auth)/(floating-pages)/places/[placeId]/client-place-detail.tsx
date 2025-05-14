"use client";

import { PlaceAboutTab } from "@/components/places/detail/place-about-tab";
import { PlaceDetailHeader } from "@/components/places/detail/place-detail-header";
import { PlaceEventsTab } from "@/components/places/detail/place-events-tab";
import { PlaceReviewsTab } from "@/components/places/detail/place-reviews-tab";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventType } from "@/modules/events/types/events";
import { getPlaceReviews } from "@/modules/places";
import { createReview } from "@/modules/places/actions/reviews";
import { PlaceType, ReviewType } from "@/modules/places/types/places";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type ClientPlaceDetailProps = {
  place: PlaceType;
  upcomingEvents: EventType[];
  initialReviews: ReviewType[];
  placeId: string;
  initialTab?: string;
};

const ClientPlaceDetail = ({
  place,
  upcomingEvents,
  initialReviews,
  placeId,
  initialTab = "about",
}: ClientPlaceDetailProps) => {
  const [reviews, setReviews] = useState<ReviewType[]>(initialReviews);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);
  useEffect(() => {
    console.log("Component mounted with data:", reviews);
  }, [reviews]);
  const router = useRouter();

  // Update URL when tab changes - use router.replace to avoid history entries
  useEffect(() => {
    if (activeTab !== initialTab) {
      router.replace(`/places/${placeId}?tab=${activeTab}`, { scroll: false });
    }
  }, [activeTab, initialTab, placeId, router]);

  // Handle adding a new review
  const handleAddReview = async (rating: number, comment: string) => {
    setIsSubmitting(true);
    try {
      const result = await createReview({
        placeId: placeId,
        rating,
        comment,
      });

      if (result.type === "success") {
        const updatedReviews = await getPlaceReviews(placeId);
        setReviews(updatedReviews);

        // Switch to reviews tab
        setActiveTab("reviews");

        toast.success("Review added successfully");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error adding review:", error);
      toast.error("Failed to add review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PlaceDetailHeader place={place} />

      <ScrollArea className="h-[calc(100vh-500px)]">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6">
          <TabsList className="flex gap-4 mb-4">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <PlaceAboutTab place={place} />
          </TabsContent>

          <TabsContent value="events">
            <PlaceEventsTab
              placeId={place.id}
              upcomingEvents={upcomingEvents}
            />
          </TabsContent>

          <TabsContent value="reviews">
            <PlaceReviewsTab
              place={place}
              reviews={reviews}
              onAddReview={handleAddReview}
              isSubmitting={isSubmitting}
            />
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </>
  );
};

export default ClientPlaceDetail;
