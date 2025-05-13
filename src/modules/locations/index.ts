import { userLocation } from "@/db/schemas/user-locations";
import { InferSelectModel } from "drizzle-orm";
import { UserLocation } from "./types/locations";

export const mapDbLocationToUserLocation = (
  location: InferSelectModel<typeof userLocation>,
): UserLocation => {
  return {
    userId: location.userId,
    location: [location.latitude, location.longitude],
    updatedAt: new Date(location.updatedAt),
  };
};

export const mapDbLocationsToUserLocations = (
  locations: InferSelectModel<typeof userLocation>[],
): UserLocation[] => {
  return locations.map(mapDbLocationToUserLocation);
};
