"use client";

import { PlaceType } from "@/modules/places/types/places";
import dynamic from "next/dynamic";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// We need to create a simpler map component specifically for showing a single place
const SimplePlaceMap = ({
  place,
  className = "",
}: {
  place: PlaceType;
  className?: string;
}) => {
  if (!place.latitude || !place.longitude) return null;

  const center: [number, number] = [
    Number(place.latitude),
    Number(place.longitude),
  ];

  return (
    <div className={`h-[250px] w-full ${className}`}>
      <MapContainer
        center={center}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
        zoomControl
        attributionControl={false}
        className="rounded-md"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center}>
          <Popup>
            <div className="p-1">
              <h3 className="font-medium text-sm">{place.name}</h3>
              <p className="text-xs text-gray-600">{place.address}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

// Dynamic import to avoid SSR issues with Leaflet
const PlaceLocationMap = dynamic(() => Promise.resolve(SimplePlaceMap), {
  ssr: false,
  loading: () => (
    <div className="h-[250px] bg-gray-200 rounded-md animate-pulse" />
  ),
});

export default PlaceLocationMap;
