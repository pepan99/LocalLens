import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReviewType } from "@/modules/places/types/places";
import { MoreHorizontal, Star, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { AddReviewDialog } from "./add-review-dialog";

interface PlaceReviewsTabProps {
  place: {
    id: string;
    name: string;
    rating?: number | null;
  };
  reviews: ReviewType[];
  onAddReview: (rating: number, content: string) => void;
  isSubmitting?: boolean;
}

// Safe date formatting function with error handling
const formatDate = (date: Date | string | number | null | undefined) => {
  // Return a placeholder if date is invalid
  if (!date) return "Unknown date";

  try {
    // Convert to Date object if it's a string or number
    const dateObj = date instanceof Date ? date : new Date(date);

    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return "Invalid date";
    }

    // Format the date
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Date format error";
  }
};

export const PlaceReviewsTab = ({
  place,
  reviews,
  onAddReview,
  isSubmitting = false,
}: PlaceReviewsTabProps) => {
  const [isAddReviewDialogOpen, setIsAddReviewDialogOpen] = useState(false);

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0]; // 5 stars, 4 stars, etc.

    reviews.forEach(review => {
      distribution[5 - review.rating]++;
    });

    return distribution;
  };

  // Mock functions for like/dislike that can be implemented later
  const handleLikeReview = (reviewId: string) => {
    console.log("Like review:", reviewId);
  };

  const handleDislikeReview = (reviewId: string) => {
    console.log("Dislike review:", reviewId);
  };

  const placeRating = place.rating || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-medium">Reviews</h2>
          <p className="text-gray-500">
            {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
          </p>
        </div>
        <Button
          onClick={() => setIsAddReviewDialogOpen(true)}
          disabled={isSubmitting}
        >
          Write a Review
        </Button>
      </div>

      {reviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">
                {placeRating.toFixed(1)}
              </span>
              <div className="space-y-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.round(placeRating)
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  Based on {reviews.length} reviews
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Rating Distribution</h3>
            <div className="space-y-1">
              {getRatingDistribution().map((count, index) => (
                <div key={5 - index} className="flex items-center gap-2">
                  <span className="text-xs w-6">{5 - index} ★</span>
                  <div className="h-2 bg-gray-200 rounded-full flex-1 overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 rounded-full"
                      style={{
                        width: `${reviews.length > 0 ? (count / reviews.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs w-6 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map(review => (
            <div key={review.id} className="border rounded-lg p-4">
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>
                      {review.username?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{review.username || "User"}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= review.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-3 text-gray-700">{review.comment}</p>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4">
                  <button
                    className="flex items-center text-gray-500 hover:text-gray-700"
                    onClick={() => handleLikeReview(review.id)}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    <span className="text-xs">{review.likes || 0}</span>
                  </button>
                  <button
                    className="flex items-center text-gray-500 hover:text-gray-700"
                    onClick={() => handleDislikeReview(review.id)}
                  >
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    <span className="text-xs">{review.dislikes || 0}</span>
                  </button>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Report Review</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Star className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium">No reviews yet</h3>
            <p className="mt-1 text-gray-500">
              Be the first to review this place
            </p>
            <Button
              className="mt-4"
              onClick={() => setIsAddReviewDialogOpen(true)}
              disabled={isSubmitting}
            >
              Write a Review
            </Button>
          </div>
        )}
      </div>

      <AddReviewDialog
        open={isAddReviewDialogOpen}
        onOpenChange={setIsAddReviewDialogOpen}
        placeName={place.name}
        onAddReview={onAddReview}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
