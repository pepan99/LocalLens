"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventType } from "@/modules/events/types/events";
import { PlaceType } from "@/modules/places";
import { MapPin } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { PlaceCard } from "./place-card";

type PlacesWithEvents = { place: PlaceType; events: EventType[] }[];

type PlacesListProps = {
  placesWithEvents: PlacesWithEvents;
};

export const PlacesList = ({ placesWithEvents }: PlacesListProps) => {
  return (
    <Tabs defaultValue="grid">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
        </TabsList>
        <div className="text-sm text-gray-500">
          {placesWithEvents.length}{" "}
          {placesWithEvents.length === 1 ? "place" : "places"} found
        </div>
      </div>

      <TabsContent value="grid">
        <ScrollArea className="h-[600px] pr-4">
          {placesWithEvents.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <MapPin className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">No places found</h3>
              <p className="mt-1 text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {placesWithEvents.map(placeWithEvents => (
                <PlaceCard
                  key={placeWithEvents.place.id}
                  place={placeWithEvents.place}
                  events={placeWithEvents.events}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
};
