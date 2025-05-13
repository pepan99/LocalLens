import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PlaceType } from "@/modules/places";
import { ExternalLink, Globe, Phone } from "lucide-react";

export const PlaceAboutTab = ({ place }: { place: PlaceType }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <div>
          <h2 className="text-lg font-medium mb-2">Description</h2>
          <p className="text-gray-700">
            {place.description || "No description available."}
          </p>
        </div>

        {place.categories && place.categories.length > 0 && (
          <div>
            <h2 className="text-lg font-medium mb-2">Categories</h2>
            <div className="flex flex-wrap gap-2">
              {place.categories.map(category => (
                <Badge key={category} variant="secondary">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {place.amenities && place.amenities.length > 0 && (
          <div>
            <h2 className="text-lg font-medium mb-2">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {place.amenities.map(amenity => (
                <Badge key={amenity} variant="outline">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {place.latitude && place.longitude && (
          <div>
            <h2 className="text-lg font-medium mb-2">Location</h2>
            <div className="h-48 rounded-md bg-gray-200 overflow-hidden">
              {/* In a real app, this would be a map component showing the place location */}
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">
                  Location: {Number(place.latitude).toFixed(5)},{" "}
                  {Number(place.longitude).toFixed(5)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <Card className="p-4">
          <h2 className="text-lg font-medium mb-2">Contact Information</h2>
          <div className="space-y-2">
            {place.phone && (
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-gray-500" />
                <span>{place.phone}</span>
              </div>
            )}
            {place.website && (
              <div className="flex items-center text-sm">
                <Globe className="h-4 w-4 mr-2 text-gray-500" />
                <a
                  href={place.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center"
                >
                  Visit website
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            )}
          </div>
        </Card>

        {place.openingHours && place.openingHours.length > 0 && (
          <Card className="p-4">
            <h2 className="text-lg font-medium mb-2">Opening Hours</h2>
            <div className="space-y-1">
              {place.openingHours.map(item => (
                <div key={item.day} className="flex justify-between text-sm">
                  <span className="font-medium">{item.day}</span>
                  <span className="text-gray-700">{item.hours}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
