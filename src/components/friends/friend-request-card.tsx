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
  Check,
  Clock,
  MapPin,
  User,
  UserCheck,
  UserPlus,
  X,
} from "lucide-react";
import { FriendRequest } from "./types";
import { formatTimeAgo } from "./utils";

interface FriendRequestCardProps {
  request: FriendRequest;
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
  onCancel: (requestId: string) => void;
}

const FriendRequestCard = ({
  request,
  onAccept,
  onReject,
  onCancel,
}: FriendRequestCardProps) => {
  const isIncoming = request.direction === "incoming";

  return (
    <Card className="overflow-hidden group border hover:border-gray-300 transition-colors duration-300 hover:shadow-sm">
      <CardHeader className="pb-2 px-4 pt-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12 border-2 border-white shadow">
            <AvatarImage src={request.imageUrl} alt={request.name} />
            <AvatarFallback className="bg-gradient-to-br from-orange-100 to-amber-100 text-amber-700">
              {request.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3
                className="text-base font-medium truncate"
                title={request.name}
              >
                {request.name}
              </h3>
              <Badge
                variant={isIncoming ? "secondary" : "outline"}
                className={
                  isIncoming
                    ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                    : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                }
              >
                {isIncoming ? (
                  <UserPlus className="h-3 w-3 mr-1" />
                ) : (
                  <UserCheck className="h-3 w-3 mr-1" />
                )}
                {isIncoming ? "Incoming" : "Sent"}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 truncate">
              @{request.username}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-3 text-sm space-y-2">
        <div className="flex items-center text-gray-600">
          <MapPin className="h-4 w-4 mr-1.5 shrink-0 text-gray-500" />
          <span className="truncate" title={request.location}>
            {request.location}
          </span>
        </div>

        <div className="flex items-center text-gray-500">
          <Clock className="h-4 w-4 mr-1.5 shrink-0" />
          <span>
            {isIncoming ? "Received" : "Sent"} {formatTimeAgo(request.sentAt)}
          </span>
        </div>
      </CardContent>

      <CardFooter className="bg-gray-50 px-4 py-3 flex justify-end items-center gap-2">
        {isIncoming ? (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReject(request.id)}
              className="w-24 gap-1"
            >
              <X className="h-4 w-4" />
              Decline
            </Button>
            <Button
              size="sm"
              onClick={() => onAccept(request.id)}
              className="w-24 gap-1 bg-emerald-600 hover:bg-emerald-700"
            >
              <Check className="h-4 w-4" />
              Accept
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCancel(request.id)}
            className="gap-1"
          >
            <X className="h-4 w-4" />
            Cancel Request
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default FriendRequestCard;
