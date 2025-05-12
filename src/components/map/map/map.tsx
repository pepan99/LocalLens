"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Must imported to make the leaflet work correctly
import "leaflet/dist/leaflet.js"; // Must imported to make the leaflet work correctly

import { Button } from "@/components/ui/button";
import { EventType, RSVPStatusEnum } from "@/modules/events/types/events";
import { FriendType } from "@/types/friends";
import { Compass, Locate, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import EventMarker from "../markers/event-marker";
import UserMarker from "../markers/user-marker";

const MOCK_FRIENDS: FriendType[] = [
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
  events: EventType[];
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
  events = [],
  ...otherProps
}: MapProps) => {
  const [center, setCenter] = useState<[number, number] | undefined>(
    initialCenter,
  );
  const [currentLocation, setCurrentLocation] = useState<
    [number, number] | null
  >(null);
  const mapRef = useRef<L.Map | null>(null);
  // const [events, setEventsState] = useState<EventType[]>([]);

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

  // Handle RSVP status changes
  const handleRSVPChange = (eventId: string, status: RSVPStatusEnum) => {
    // Find the event
    const event = events.find(e => e.id === eventId);

    if (event) {
      // Show a toast notification
      const message =
        status === RSVPStatusEnum.GOING
          ? `You're going to ${event.title}!`
          : status === RSVPStatusEnum.MAYBE
            ? `You might attend ${event.title}.`
            : `You've declined ${event.title}.`;

      toast(message);

      // In a real app, you might update the marker state or trigger a refresh
      // For now, we'll leave the visual update to the marker component itself
    }
  };
  console.log("Map component rendered with events:", events);

  return (
    <MapContainer
      ref={mapRef}
      center={initialCenter}
      zoom={initialZoom}
      style={{ height: "100%", width: "100%" }}
      className="z-0 h-screen w-screen absolute top-0 left-0 pt-14"
      zoomControl={false}
      scrollWheelZoom
      {...otherProps}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapController
        center={center}
        zoom={mapRef.current?.getZoom() || initialZoom}
        trackLocation={trackLocation}
      />

      {/* Custom map controls */}
      <div className="leaflet-control-container">
        <div className="leaflet-top leaflet-right">
          <div className="leaflet-control leaflet-bar top-24 bg-white shadow-lg rounded-lg overflow-hidden flex flex-col m-4">
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
        events.map(event => (
          <EventMarker
            key={event.id}
            event={event}
            onRSVPChange={handleRSVPChange}
          />
        ))}

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
