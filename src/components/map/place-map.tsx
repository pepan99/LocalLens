"use client";

import { PlaceType } from "@/modules/places/types/places";
import dynamic from "next/dynamic";
import { FC } from "react";

// Lazy load the map component to avoid SSR issues with Leaflet
const SimpleMap = dynamic(() => import("./simple-map"), {
  ssr: false,
  loading: () => <div className="h-48 bg-gray-200 rounded-md animate-pulse" />,
});

type PlaceMapProps = {
  place: PlaceType;
  height?: string;
  className?: string;
};

const PlaceMap: FC<PlaceMapProps> = ({
  place,
  height = "200px",
  className = "",
}) => {
  if (!place.latitude || !place.longitude) {
    return (
      <div
        className={`h-48 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 ${className}`}
      >
        No location data available
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-md overflow-hidden ${className}`}
      style={{ height }}
    >
      <SimpleMap
        place={place}
        center={[Number(place.latitude), Number(place.longitude)]}
        zoom={15}
      />
    </div>
  );
};

export default PlaceMap;
