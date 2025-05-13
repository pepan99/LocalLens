"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Clock, MapPin, MoreVertical } from "lucide-react";
import { Friend } from "./types";
import { formatTimeAgo } from "./utils";

interface FriendCardProps {
  friend: Friend;
  onRemoveFriend: (friendId: string) => void;
  onInviteToEvent: (friendId: string) => void;
}

const FriendCard = ({
  friend,
  onRemoveFriend,
  onInviteToEvent,
}: FriendCardProps) => {
  return (
    <Card className="overflow-hidden group border hover:border-gray-300 transition-colors duration-300 hover:shadow-sm">
      <CardHeader className="pb-2 px-4 pt-4 flex-row items-start gap-3">
        <Avatar className="h-14 w-14 border-2 border-white shadow">
          <AvatarImage src={friend.imageUrl} alt={friend.name} />
          <AvatarFallback className="bg-gradient-to-br from-blue-100 to-violet-100 text-indigo-700">
            {friend.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <h3 className="text-lg font-medium truncate" title={friend.name}>
                {friend.name}
              </h3>
              <p className="text-sm text-gray-500 truncate">
                @{friend.username}
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-500 hover:text-gray-900"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => onInviteToEvent(friend.id)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span>Invite to Event</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onRemoveFriend(friend.id)}
                  className="text-red-600 focus:text-red-700 focus:bg-red-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4"
                  >
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <line x1="18" y1="8" x2="23" y2="13" />
                    <line x1="23" y1="8" x2="18" y2="13" />
                  </svg>
                  <span>Remove Friend</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-3 text-sm space-y-2">
        <div className="flex items-center text-gray-600">
          <MapPin className="h-4 w-4 mr-1.5 shrink-0 text-gray-500" />
          <span className="truncate" title={friend.location}>
            {friend.location}
          </span>
        </div>

        <div className="flex items-center">
          {friend.isOnline ? (
            <div className="flex items-center text-emerald-600">
              <span className="h-2 w-2 bg-emerald-500 rounded-full mr-1.5" />
              <span>Online now</span>
            </div>
          ) : (
            <div className="flex items-center text-gray-500">
              <Clock className="h-3.5 w-3.5 mr-1.5 shrink-0" />
              <span>Last active {formatTimeAgo(friend.lastActive)}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="bg-gray-50 px-4 py-3 flex justify-between items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {friend.isSharingLocation ? (
                <Badge
                  variant="outline"
                  className="flex items-center text-emerald-600 bg-emerald-50 border-emerald-200"
                >
                  <MapPin className="h-3 w-3 mr-1 shrink-0" />
                  <span className="truncate max-w-[100px]">
                    Sharing location
                  </span>
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="flex items-center text-gray-500"
                >
                  <MapPin className="h-3 w-3 mr-1 shrink-0" />
                  <span className="truncate max-w-[100px]">Not sharing</span>
                </Badge>
              )}
            </TooltipTrigger>
            <TooltipContent>
              {friend.isSharingLocation
                ? "This friend is sharing their location on the map"
                : "This friend is not sharing their location"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
};

export default FriendCard;
