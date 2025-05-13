import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useState } from "react";

interface AddReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placeName: string;
  onAddReview: (rating: number, content: string) => void;
  isSubmitting?: boolean;
}

export const AddReviewDialog = ({
  open,
  onOpenChange,
  placeName,
  onAddReview,
  isSubmitting = false,
}: AddReviewDialogProps) => {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);

  const handleAddReview = () => {
    if (rating === 0 || !reviewText.trim() || isSubmitting) return;

    onAddReview(rating, reviewText);
    // Don't reset form or close dialog immediately - wait for submission to complete
    // The parent component will close the dialog via onOpenChange when complete
  };

  // Reset form when dialog opens
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setReviewText("");
      setRating(0);
    }
    onOpenChange(open);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={isSubmitting ? undefined : handleOpenChange}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
          <DialogDescription>
            Share your experience at {placeName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <span className="text-sm font-medium">Rating</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                  disabled={isSubmitting}
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= rating
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    } ${isSubmitting ? "opacity-50" : ""}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="review" className="text-sm font-medium">
              Review
            </label>
            <Textarea
              id="review"
              placeholder="Share details about your experience at this place..."
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              className="min-h-[120px]"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddReview}
            disabled={rating === 0 || !reviewText.trim() || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
