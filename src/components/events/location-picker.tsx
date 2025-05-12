"use client";

import L from "leaflet";
import { useCallback, useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { Locate } from "lucide-react";

// Custom marker icon
const createMarkerIcon = () => {
  return L.divIcon({
    className: "custom-marker-icon",
    html: `
      <div style="background-color: #f43f5e; width: 30px; height: 30px; border-radius: 50%; display: flex; justify-content: center; align-items: center; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

// Component that handles map clicks and marker placement
const InteractiveMarker = ({
  onLocationSelected,
  initialLocation,
}: {
  onLocationSelected: (lat: number, lng: number) => void;
  initialLocation?: [number, number];
}) => {
  const [position, setPosition] = useState<[number, number] | null>(
    initialLocation || null,
  );

  // Initialize with the initial location if provided
  useEffect(() => {
    if (initialLocation) {
      setPosition(initialLocation);
    }
  }, [initialLocation]);

  // Create event listeners for map
  useMapEvents({
    click: e => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelected(lat, lng);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={createMarkerIcon()} />
  );
};

// A simple component for displaying a static marker on the map
const StaticMarker = ({ position }: { position: [number, number] }) => {
  return <Marker position={position} icon={createMarkerIcon()} />;
};

type LocationPickerProps = {
  onLocationSelected: (lat: number, lng: number) => void;
  initialLocation?: [number, number];
  viewOnly?: boolean; // New prop to determine if the map is view-only
};

const LocationPicker = ({
  onLocationSelected,
  initialLocation = [49.21, 16.599], // Brno as default
  viewOnly = false, // Default to interactive mode
}: LocationPickerProps) => {
  const [_myLocation, setMyLocation] = useState<[number, number] | null>(null);

  // Get user's current location
  const getCurrentLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setMyLocation([latitude, longitude]);

        // If not in view-only mode, update the selected location
        if (!viewOnly) {
          onLocationSelected(latitude, longitude);
        }
      },
      error => {
        console.error("Error getting location:", error);
      },
      { enableHighAccuracy: true },
    );
  }, [viewOnly, onLocationSelected]);

  return (
    <div className="h-full relative">
      <MapContainer
        center={initialLocation}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        // Disable drag and zoom in view-only mode if desired
        // dragging={!viewOnly}
        // zoomControl={!viewOnly}
        // scrollWheelZoom={!viewOnly}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Render the appropriate marker based on mode */}
        {viewOnly ? (
          <StaticMarker position={initialLocation} />
        ) : (
          <InteractiveMarker
            onLocationSelected={onLocationSelected}
            initialLocation={initialLocation}
          />
        )}

        {/* Only show controls in interactive mode */}
        {!viewOnly && (
          <div className="leaflet-control-container">
            <div className="leaflet-top leaflet-right">
              <div className="leaflet-control leaflet-bar">
                <Button
                  variant="default"
                  size="sm"
                  className="rounded-none"
                  onClick={getCurrentLocation}
                >
                  <Locate className="h-4 w-4 mr-2" />
                  <span>Use my location</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </MapContainer>

      {/* Only show help text in interactive mode */}
      {!viewOnly && (
        <div className="absolute bottom-2 left-0 right-0 text-center text-sm text-gray-600 bg-white/70 py-1">
          Click on the map to set the event location
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
