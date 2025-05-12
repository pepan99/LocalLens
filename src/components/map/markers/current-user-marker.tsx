"use client";

import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import "./user-marker.css";

// Create custom icon for user markers
const createUserIcon = () => {
  const defaultIcon = `
<div style="background-color: #3b82f6; width: 36px; height: 36px; border-radius: 50%; display: flex; justify-content: center; align-items: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.25);">
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
</div>
`;

  return L.divIcon({
    className: "custom-user-marker",
    html: defaultIcon,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

type UserMarkerProps = {
  coordinates: [number, number];
};

const CurrentUserMarker = ({ coordinates }: UserMarkerProps) => {
  return (
    <Marker position={coordinates} icon={createUserIcon()}>
      <Popup className="user-popup">
        <p className="font-medium">You</p>
      </Popup>
    </Marker>
  );
};

export default CurrentUserMarker;
