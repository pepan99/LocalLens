"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Clock, MapPin, User, X } from "lucide-react";
import { FriendRequest } from "../types";
import { formatTimeAgo } from "../utils";

interface PendingRequestsListProps {
  requests: FriendRequest[];
  onAcceptRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
  onCancelRequest: (requestId: string) => void;
}

const PendingRequestsList = ({
  requests,
  onAcceptRequest,
  onRejectRequest,
  onCancelRequest,
}: PendingRequestsListProps) => {
  if (requests.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <User className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium">No pending requests</h3>
        <p className="mt-1 text-gray-500">
          You don&apos;t have any friend requests at the moment
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {requests.map(request => (
        <Card key={request.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={request.imageUrl} alt={request.name} />
                  <AvatarFallback>
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    {request.name}
                    <Badge
                      variant={
                        request.direction === "incoming"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {request.direction === "incoming" ? "Incoming" : "Sent"}
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-gray-500">@{request.username}</p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{request.location}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <Clock className="h-4 w-4 mr-1" />
              <span>
                {request.direction === "incoming" ? "Received" : "Sent"}{" "}
                {formatTimeAgo(request.sentAt)}
              </span>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 px-4 py-3 flex justify-end items-center gap-2">
            {request.direction === "incoming" ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRejectRequest(request.id)}
                >
                  <X className="h-4 w-4 mr-1" />
                  Decline
                </Button>
                <Button size="sm" onClick={() => onAcceptRequest(request.id)}>
                  <Check className="h-4 w-4 mr-1" />
                  Accept
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCancelRequest(request.id)}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel Request
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PendingRequestsList;
