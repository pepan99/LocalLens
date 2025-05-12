import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlaceType } from "@/modules/places";
import { ChevronLeft, Heart, MapPin, Share, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PlaceDetailHeaderProps {
  place: PlaceType;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export const PlaceDetailHeader = ({
  place,
  isFavorite = false,
  onToggleFavorite,
}: PlaceDetailHeaderProps) => {
  const router = useRouter();

  return (
    <div className="relative">
      <div className="h-48 bg-gray-200 relative">
        {place.image && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${place.image})` }}
          />
        )}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            className="bg-white/80 hover:bg-white"
            onClick={() => router.push("/places")}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex gap-2">
            {onToggleFavorite && (
              <Button
                variant="outline"
                size="sm"
                className={`${
                  isFavorite
                    ? "bg-primary text-white"
                    : "bg-white/80 hover:bg-white"
                }`}
                onClick={onToggleFavorite}
              >
                <Heart
                  className={`h-4 w-4 ${isFavorite ? "fill-white" : ""}`}
                />
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="bg-white/80 hover:bg-white"
              onClick={() => {
                navigator
                  .share?.({
                    title: place.name,
                    text: place.description || `Check out ${place.name}`,
                    url: window.location.href,
                  })
                  .catch(err => console.error("Error sharing:", err));
              }}
            >
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start flex-wrap">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">{place.name}</h1>
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{place.address}</span>
            </div>
            <div className="flex items-center space-x-2 mt-2 flex-wrap gap-2">
              {/* Primary category */}
              <Badge variant="secondary">{place.category}</Badge>

              {/* Additional categories */}
              {place.categories &&
                place.categories
                  .filter(cat => cat !== place.category)
                  .map(category => (
                    <Badge key={category} variant="outline">
                      {category}
                    </Badge>
                  ))}

              <div className="flex items-center ml-2">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                <span className="font-medium">
                  {place.rating?.toFixed(1) || "N/A"}
                </span>
                <span className="text-gray-500 ml-1">
                  ({place.reviewCount || 0} reviews)
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 space-x-2">
            <Button asChild>
              <Link href={`/events/create?placeId=${place.id}`}>
                Create Event Here
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
