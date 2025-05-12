"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import L from "leaflet";
import { Clock, MapPin, User } from "lucide-react";
import { Marker, Popup } from "react-leaflet";
import { Card, CardContent, CardFooter, CardHeader } from "../../ui/card";
import "./user-marker.css";
import { UserWithLocation } from "@/modules/locations/types/locations";

/**
 * Generates a random CSS color in hexadecimal format
 * @returns A random color in the format #RRGGBB
 */
const generateRandomColor = (): string => {
  // Generate a random number and convert it to a hexadecimal string
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);

  // Ensure the color has 6 digits by padding with leading zeros if needed
  const paddedColor = randomColor.padStart(6, "0");

  // Return the color with a # prefix
  return `#${paddedColor}`;
};

// Create custom icon for user markers
const createUserIcon = (user: UserWithLocation) => {
  const defaultIcon = `<div style="position: relative; width: 30px; height: 30px;">
             <div style="background-color: ${generateRandomColor()}; width: 30px; height: 30px; border-radius: 50%; display: flex; justify-content: center; align-items: center; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">
               <span style="color: white; font-weight: bold;">${user.name[0] ?? "O"}</span>
             </div>
           </div>,
`;

  const customIcon = user.imageUrl
    ? `
  <div style="width: 36px; height: 36px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.25); overflow: hidden;">
  <img src="${user.imageUrl}" style="width: 100%; height: 100%; object-fit: cover;" />
  </div>
  `
    : defaultIcon;

  return L.divIcon({
    className: "custom-user-marker",
    html: customIcon,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

type UserMarkerProps = {
  user: UserWithLocation;
  coordinates: [number, number];
  isCurrentUser?: boolean;
};

const UserMarker = ({
  user,
  coordinates,
  isCurrentUser = false,
}: UserMarkerProps) => {
  const timeAgo = user.lastUpdated
    ? Math.round(
        (new Date().getTime() - new Date(user.lastUpdated).getTime()) /
          (1000 * 60),
      )
    : null;

  return (
    <Marker position={coordinates} icon={createUserIcon(user)}>
      <Popup className="user-popup" minWidth={180} maxWidth={240}>
        <Card className="border-0 py-2 shadow-none overflow-hidden">
          <CardHeader className="pb-2 pt-3 px-3">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.imageUrl ?? undefined} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.name}</p>
                {isCurrentUser && <p className="text-xs text-green-600">You</p>}
              </div>
            </div>
          </CardHeader>
          <CardContent className="py-1 px-3">
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <MapPin className="h-3 w-3 mr-1" />
              <span>Sharing location</span>
            </div>
            {timeAgo !== null && (
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Clock className="h-3 w-3 mr-1" />
                <span>Updated {timeAgo} min ago</span>
              </div>
            )}
          </CardContent>
          {!isCurrentUser && (
            <CardFooter className="py-2 px-3 gap-2">
              <Button size="sm" variant="default">
                Invite
              </Button>
            </CardFooter>
          )}
        </Card>
      </Popup>
    </Marker>
  );
};

export default UserMarker;
