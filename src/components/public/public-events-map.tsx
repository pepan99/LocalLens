"use client";

import { Button } from "@/components/ui/button";
import { EventType } from "@/modules/events/types/events";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Calendar, Clock, User } from "lucide-react";
import { useEffect, useRef } from "react";
import { useLocation } from "../map/location_provider";
import CurrentUserMarker from "../map/markers/current-user-marker";

type PublicEventsMapProps = {
  events: EventType[];
};

// Define custom icon for event markers with RSVP status
const createEventIcon = (event: EventType) => {
  // Base color by category
  let color = "#0ea5e9"; // Default blue

  switch (event.category) {
    case "Technology":
      color = "#0ea5e9"; // Blue
      break;
    case "Food":
      color = "#f97316"; // Orange
      break;
    case "Arts":
      color = "#8b5cf6"; // Purple
      break;
    case "Sports":
      color = "#22c55e"; // Green
      break;
    case "Music":
      color = "#f43f5e"; // Pink
      break;
    default:
      color = "#0ea5e9"; // Default blue
  }

  return L.divIcon({
    className: "custom-event-marker",
    html: `<div style="position: relative; width: 30px; height: 30px;">
             <div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 5%; display: flex; justify-content: center; align-items: center; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">
               <span style="color: white; font-weight: bold;">E</span>
             </div>
           </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

const PublicEventsMap = ({ events }: PublicEventsMapProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    console.log(events);
  }, [events]);

  const userLocation = useLocation();

  const handleMarkerClick = (eventId: string) => {
    if (session) {
      router.push(`/events/${eventId}`);
    } else {
      router.push(`/discover/events/${eventId}`);
    }
  };

  return (
    <MapContainer
      center={[49.19522, 16.60796]}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {userLocation?.position && (
        <CurrentUserMarker coordinates={userLocation.position} />
      )}

      {/* Event markers */}
      {events.map(event => (
        <Marker
          key={event.id}
          position={[event.latitude, event.longitude]}
          icon={createEventIcon(event)}
        >
          <Popup>
            <div className="p-1">
              <h3 className="font-bold text-lg">{event.title}</h3>
              <div className="text-sm space-y-1 my-2">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  <span>{event.attendees} attendees</span>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" onClick={() => handleMarkerClick(event.id)}>
                  View Details
                </Button>
                {!session && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push("/login")}
                  >
                    Login to RSVP
                  </Button>
                )}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default PublicEventsMap;
