"use client";

import { PlaceCardEventInfo } from "@/app/(auth)/(floating-pages)/places/place-card-event-info";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EventType } from "@/modules/events/types/events";
import { PlaceType } from "@/modules/places";
import { Clock, MapPin, Star } from "lucide-react";
import Link from "next/link";
import React from "react";

type PlaceCardProps = {
  place: PlaceType;
  events?: EventType[];
};

export const PlaceCard = ({ place, events = [] }: PlaceCardProps) => {
  const getDisplayHours = () => {
    console.log(place);
    if (!place.openingHours || place.openingHours.length === 0)
      return "Hours not available";
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    const todayHours = place.openingHours.find(h => h.day === today);
    if (todayHours) return `Today: ${todayHours.hours}`;
    return `${place.openingHours[0].day}: ${place.openingHours[0].hours}`;
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative h-40 bg-gradient-to-r from-primary/80 to-blue-600/80">
        {place.image && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-90"
              style={{ backgroundImage: `url(${place.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
          </>
        )}
      </div>
      <CardHeader className="pb-2 px-4">
        <div className="flex justify-between items-start">
          <Link href={`/places/${place.id}`} className="hover:underline">
            <CardTitle className="text-lg max-w-[160] truncate">
              {place.name}
            </CardTitle>
          </Link>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
            <span className="font-medium">
              {place.rating?.toFixed(1) || "No ratings"}
            </span>
            <span className="text-gray-500 text-xs ml-1">
              ({place.reviewCount || 0})
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3 px-4">
        <div className="flex items-center text-sm text-gray-500 mb-1">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="truncate">{place.address}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 mb-1">
          <Clock className="h-4 w-4 mr-1" />
          <span>{getDisplayHours()}</span>
        </div>
        {place.distance && (
          <div className="text-sm text-gray-500">
            {place.distance.toFixed(1)} km away
          </div>
        )}
        <div className="flex flex-wrap gap-1 mt-2">
          <Badge variant="secondary">{place.category}</Badge>
          {place.categories &&
            place.categories.length > 1 &&
            place.categories
              .filter(cat => cat !== place.category)
              .slice(0, 1)
              .map(category => (
                <Badge key={category} variant="outline">
                  {category}
                </Badge>
              ))}
          {place.categories && place.categories.length > 2 && (
            <Badge variant="outline" className="bg-white/80">
              +{place.categories.length - 2}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-gray-50 px-4 py-3 border-t">
        <PlaceCardEventInfo events={events} />
        <Button size="sm" asChild className="whitespace-nowrap">
          <Link href={`/places/${place.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
