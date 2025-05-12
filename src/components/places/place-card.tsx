import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlaceType } from "@/modules/places";
import { Calendar, Clock, Heart, MapPin, Star } from "lucide-react";
import Link from "next/link";

type PlaceCardProps = {
  place: PlaceType;
  onToggleFavorite?: (placeId: string) => void;
};

export const PlaceCard = ({ place, onToggleFavorite }: PlaceCardProps) => {
  // Function to get opening hours for display
  const getDisplayHours = () => {
    if (!place.openingHours || place.openingHours.length === 0)
      return "Hours not available";

    // Get current day
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

    // Find today's hours
    const todayHours = place.openingHours.find(h => h.day === today);
    if (todayHours) return `Today: ${todayHours.hours}`;

    // Default to first available hours
    return `${place.openingHours[0].day}: ${place.openingHours[0].hours}`;
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative h-40 bg-gray-200">
        {place.image && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${place.image})` }}
          />
        )}
        {onToggleFavorite && (
          <button
            className={`absolute top-2 right-2 p-1.5 rounded-full ${
              place.isFavorite
                ? "bg-primary text-white"
                : "bg-white/80 text-gray-700"
            }`}
            onClick={() => onToggleFavorite(place.id)}
          >
            <Heart
              className={`h-4 w-4 ${place.isFavorite ? "fill-white" : ""}`}
            />
          </button>
        )}
        <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
          <Badge variant="secondary">{place.category}</Badge>
          {place.categories && place.categories.length > 1 && (
            <Badge variant="outline" className="bg-white/80">
              +{place.categories.length - 1}
            </Badge>
          )}
        </div>
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Link href={`/places/${place.id}`} className="hover:underline">
            <CardTitle className="text-lg">{place.name}</CardTitle>
          </Link>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
            <span className="font-medium">
              {place.rating?.toFixed(1) || "N/A"}
            </span>
            <span className="text-gray-500 text-xs ml-1">
              ({place.reviewCount || 0})
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex items-center text-sm text-gray-500 mb-1">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="truncate">{place.address}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>{getDisplayHours()}</span>
          </div>
          {place.distance && (
            <span className="text-gray-500">
              {place.distance.toFixed(1)} km away
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-gray-50 px-4 py-3 border-t">
        {place.upcomingEvents && place.upcomingEvents > 0 ? (
          <Badge variant="outline" className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {place.upcomingEvents}{" "}
            {place.upcomingEvents === 1 ? "event" : "events"}
          </Badge>
        ) : (
          <span className="text-gray-500 text-sm">No upcoming events</span>
        )}
        <Button size="sm" asChild>
          <Link href={`/places/${place.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
