import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { PlaceType } from "@/modules/places";
import { MapPin } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { PlaceCard } from "./place-card";

interface PlacesListProps {
  places: PlaceType[];
  onToggleFavorite?: (placeId: string) => void;
}

export const PlacesList = ({ places, onToggleFavorite }: PlacesListProps) => {
  return (
    <Tabs defaultValue="grid">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsContent value="grid">Grid View</TabsContent>
        </TabsList>
        <div className="text-sm text-gray-500">
          {places.length} {places.length === 1 ? "place" : "places"} found
        </div>
      </div>

      <TabsContent value="grid">
        <ScrollArea className="h-[600] pr-4">
          {places.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <MapPin className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">No places found</h3>
              <p className="mt-1 text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {places.map(place => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
};
