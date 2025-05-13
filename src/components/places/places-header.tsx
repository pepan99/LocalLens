import { MapPin } from "lucide-react";

export const PlacesHeader = () => {
  return (
    <div className="flex gap-4 flex-col">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <MapPin className="h-6 w-6" />
        Places
      </h1>
      <p className="text-gray-500 mt-1">
        Discover interesting places around you
      </p>
    </div>
  );
};
