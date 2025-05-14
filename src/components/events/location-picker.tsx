"use client";

import L from "leaflet";
import { memo, useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

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

// Create a memoized marker icon to prevent recreation
const useMarkerIcon = () => {
  return useMemo(() => createMarkerIcon(), []);
};

// Component that handles map clicks and marker placement
const InteractiveMarker = memo(
  ({
    onLocationSelected,
    initialLocation,
  }: {
    onLocationSelected: (lat: number, lng: number) => void;
    initialLocation?: [number, number];
  }) => {
    const [position, setPosition] = useState<[number, number] | null>(
      initialLocation || null,
    );

    const markerIcon = useMarkerIcon();

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
      <Marker position={position} icon={markerIcon} />
    );
  },
);

InteractiveMarker.displayName = "InteractiveMarker";

// A simple component for displaying a static marker on the map
const StaticMarker = memo(({ position }: { position: [number, number] }) => {
  const markerIcon = useMarkerIcon();
  return <Marker position={position} icon={markerIcon} />;
});

StaticMarker.displayName = "StaticMarker";

type LocationPickerProps = {
  onLocationSelected: (lat: number, lng: number) => void;
  initialLocation?: [number, number];
  viewOnly?: boolean; // New prop to determine if the map is view-only
};

// Main LocationPicker component, memoized to prevent unnecessary rerenders
const LocationPicker = memo(
  ({
    onLocationSelected,
    initialLocation = [49.21, 16.599], // Brno as default
    viewOnly = false, // Default to interactive mode
  }: LocationPickerProps) => {
    // Memoize the tile layer URL to prevent rerenders
    const tileLayerUrl = useMemo(
      () => "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      [],
    );

    // We memoize callbacks and elements to minimize rerenders
    const locationMarker = useMemo(() => {
      if (viewOnly) {
        return <StaticMarker position={initialLocation} />;
      }
      return (
        <InteractiveMarker
          onLocationSelected={onLocationSelected}
          initialLocation={initialLocation}
        />
      );
    }, [viewOnly, initialLocation, onLocationSelected]);

    // Memoize help text
    const helpText = useMemo(() => {
      if (viewOnly) return null;

      return (
        <div className="absolute bottom-2 left-0 right-0 text-center text-sm text-gray-600 bg-white/70 py-1">
          Click on the map to set the event location
        </div>
      );
    }, [viewOnly]);

    return (
      <div className="h-full relative">
        <MapContainer
          center={initialLocation}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={tileLayerUrl}
          />

          {/* Render the memoized marker */}
          {locationMarker}
        </MapContainer>

        {/* Show the help text if not in view-only mode */}
        {helpText}
      </div>
    );
  },
);

LocationPicker.displayName = "LocationPicker";

export default LocationPicker;
