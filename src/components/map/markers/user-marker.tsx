"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import L from "leaflet";
import { Clock, MapPin, User } from "lucide-react";
import { Marker, Popup } from "react-leaflet";
import { Card, CardContent, CardFooter, CardHeader } from "../../ui/card";
import "./user-marker.css";

// Create custom icon for user markers
const createUserIcon = (_imageUrl?: string) => {
  const defaultIcon = `
<div style="background-color: #3b82f6; width: 36px; height: 36px; border-radius: 50%; display: flex; justify-content: center; align-items: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.25);">
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
</div>
`;

  //   const customIcon = imageUrl
  //     ? `
  // <div style="width: 36px; height: 36px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.25); overflow: hidden;">
  // <img src="${imageUrl}" style="width: 100%; height: 100%; object-fit: cover;" />
  // </div>
  // `
  //     : defaultIcon;

  return L.divIcon({
    className: "custom-user-marker",
    html: defaultIcon,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

type UserMarkerProps = {
  user: {
    id: string;
    name: string;
    imageUrl?: string;
    coordinates: [number, number];
    lastUpdated?: Date;
  };
  isCurrentUser?: boolean;
};

const UserMarker = ({ user, isCurrentUser = false }: UserMarkerProps) => {
  const timeAgo = user.lastUpdated
    ? Math.round(
        (new Date().getTime() - new Date(user.lastUpdated).getTime()) /
          (1000 * 60),
      )
    : null;

  return (
    <Marker position={user.coordinates} icon={createUserIcon(user.imageUrl)}>
      <Popup className="user-popup" minWidth={180} maxWidth={240}>
        <Card className="border-0 py-2 shadow-none overflow-hidden">
          <CardHeader className="pb-2 pt-3 px-3">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.imageUrl} />
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
              <Button size="sm" variant="outline">
                Message
              </Button>
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
