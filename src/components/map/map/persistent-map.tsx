"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet.js";
import UserMarker from "../markers/user-marker";

type PersistentMapProps = {
  children?: React.ReactNode;
};

const PersistentMap = ({ children }: PersistentMapProps) => {
  const initialCenter: [number, number] = [49.21, 16.599]; // Default center (Brno)
  const initialZoom = 13;

  const [currentLocation, setCurrentLocation] = useState<
    [number, number] | null
  >(null);
  const mapRef = useRef<L.Map | null>(null);

  // Handle getting user's current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation([latitude, longitude]);
      },
      error => {
        console.error("Error getting location:", error);
      },
    );
  }, []);

  return (
    <MapContainer
      ref={mapRef}
      center={initialCenter}
      zoom={initialZoom}
      style={{
        height: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
      }}
      className="z-0"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Current user marker */}
      {currentLocation && (
        <UserMarker
          user={{
            id: "current-user",
            name: "You",
            coordinates: currentLocation,
          }}
          isCurrentUser
        />
      )}

      {children}
    </MapContainer>
  );
};

export default PersistentMap;
