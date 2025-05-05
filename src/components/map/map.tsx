"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, useMap, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Must imported to make the leaflet work correctly
import "leaflet/dist/leaflet.js"; // Must imported to make the leaflet work correctly

import { Button } from "@/components/ui/button";
import { Compass, Locate, Minus, Plus } from "lucide-react";
import EventMarker from "./event-marker";
import UserMarker from "./user-marker";

// Mock data for events - in a real app, this would come from your API
const MOCK_EVENTS = [
  {
    id: "1",
    title: "Tech Meetup in Brno",
    category: "Technology",
    date: "2025-05-10T18:00:00",
    location: "Impact Hub, Brno",
    coordinates: [49.19, 16.61],
    attendees: 24,
    rating: 4.5,
  },
  {
    id: "2",
    title: "Weekend Farmers Market",
    category: "Food",
    date: "2025-05-09T09:00:00",
    location: "Freedom Square, Brno",
    coordinates: [49.2, 16.6],
    attendees: 120,
    rating: 4.8,
  },
  {
    id: "3",
    title: "Art Exhibition Opening",
    category: "Arts",
    date: "2025-05-15T17:00:00",
    location: "Moravian Gallery, Brno",
    coordinates: [49.195, 16.605],
    attendees: 45,
    rating: 4.3,
  },
  {
    id: "4",
    title: "Weekly Running Club",
    category: "Sports",
    date: "2025-05-07T19:00:00",
    location: "Lužánky Park, Brno",
    coordinates: [49.205, 16.615],
    attendees: 18,
    rating: 4.6,
  },
];

// Mock data for friends - in a real app, this would come from your API
const MOCK_FRIENDS = [
  {
    id: "1",
    name: "Marie Novotná",
    imageUrl: "/placeholder-user-1.jpg",
    coordinates: [49.197, 16.608],
    lastUpdated: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
  },
  {
    id: "2",
    name: "Jan Svoboda",
    imageUrl: "/placeholder-user-2.jpg",
    coordinates: [49.199, 16.599],
    lastUpdated: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
  },
];

// Component to handle map functionality like centering and zooming
const MapController = ({
  center,
  zoom,
  trackLocation = false,
}: {
  center?: [number, number];
  zoom?: number;
  trackLocation?: boolean;
}) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);

  useEffect(() => {
    if (!trackLocation) return;

    const locate = () => {
      map.locate({ setView: true, maxZoom: 16 });
    };

    locate();
    const watchId = navigator.geolocation.watchPosition(
      position => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], map.getZoom());
      },
      error => {
        console.error("Error getting location:", error);
      },
      { enableHighAccuracy: true },
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [trackLocation, map]);

  return null;
};

type MapProps = {
  children?: React.ReactNode;
  initialCenter?: [number, number];
  initialZoom?: number;
  showEvents?: boolean;
  showFriends?: boolean;
  trackLocation?: boolean;
} & Omit<
  React.ComponentProps<typeof MapContainer>,
  "center" | "zoom" | "children"
>;

const Map = ({
  children,
  initialCenter = [49.21, 16.599], // Default center (Brno)
  initialZoom = 13,
  showEvents = true,
  showFriends = true,
  trackLocation = false,
  ...otherProps
}: MapProps) => {
  const [center, setCenter] = useState<[number, number] | undefined>(
    initialCenter,
  );
  const [zoom, setZoom] = useState<number | undefined>(initialZoom);
  const [currentLocation, setCurrentLocation] = useState<
    [number, number] | null
  >(null);
  const mapRef = useRef<L.Map | null>(null);

  // Handle getting user's current location
  useEffect(() => {
    if (trackLocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation([latitude, longitude]);
          setCenter([latitude, longitude]);
        },
        error => {
          console.error("Error getting location:", error);
        },
      );
    }
  }, [trackLocation]);

  const handleZoomIn = () => {
    if (mapRef.current) {
      const newZoom = mapRef.current.getZoom() + 1;
      mapRef.current.setZoom(newZoom);
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      const newZoom = mapRef.current.getZoom() - 1;
      mapRef.current.setZoom(newZoom);
    }
  };

  const handleRecenter = () => {
    if (currentLocation) {
      setCenter(currentLocation);
      if (mapRef.current) {
        mapRef.current.setView(currentLocation, 15);
      }
    }
  };

  return (
    <MapContainer
      ref={mapRef}
      center={initialCenter}
      zoom={initialZoom}
      style={{ height: "100vh", width: "100vw" }}
      className="z-0"
      zoomControl={false}
      {...otherProps}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapController
        center={center}
        zoom={zoom}
        trackLocation={trackLocation}
      />

      {/* Custom map controls */}
      <div className="leaflet-control-container">
        <div className="leaflet-top leaflet-right">
          <div className="leaflet-control leaflet-bar bg-white shadow-lg rounded-lg overflow-hidden flex flex-col m-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-none hover:bg-gray-100"
              onClick={handleZoomIn}
            >
              <Plus className="h-5 w-5" />
            </Button>
            <div className="h-px bg-gray-200" />
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-none hover:bg-gray-100"
              onClick={handleZoomOut}
            >
              <Minus className="h-5 w-5" />
            </Button>
            <div className="h-px bg-gray-200" />
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-none hover:bg-gray-100"
              onClick={handleRecenter}
              disabled={!currentLocation}
            >
              <Locate className="h-5 w-5" />
            </Button>
            <div className="h-px bg-gray-200" />
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-none hover:bg-gray-100"
              onClick={() => setCenter(initialCenter)}
            >
              <Compass className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Event markers */}
      {showEvents &&
        MOCK_EVENTS.map(event => <EventMarker key={event.id} event={event} />)}

      {/* Friend markers */}
      {showFriends &&
        MOCK_FRIENDS.map(friend => (
          <UserMarker key={friend.id} user={friend} />
        ))}

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

export default Map;
