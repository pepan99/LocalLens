"use client";

import { PlaceType } from "@/modules/places/types/places";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type SimpleMapProps = {
  place: PlaceType;
  center: [number, number];
  zoom: number;
};

const SimpleMap = ({ place, center, zoom }: SimpleMapProps) => {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
      attributionControl={false}
      dragging={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={center} />
    </MapContainer>
  );
};

export default SimpleMap;
