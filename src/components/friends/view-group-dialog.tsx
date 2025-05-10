"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  BellRing,
  Clock,
  Edit,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Share,
  User,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { FriendGroup } from "./types";
import { formatTimeAgo } from "./utils";

interface ViewGroupDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  group: FriendGroup | null;
  onEditClick: (groupId: string) => void;
  onAddMembersClick: (groupId: string) => void;
  onInviteToEventClick: (groupId: string) => void;
  onShareGroupClick: (groupId: string) => void;
}

const ViewGroupDialog = ({
  isOpen,
  onOpenChange,
  group,
  onEditClick,
  onAddMembersClick,
  onInviteToEventClick,
  onShareGroupClick,
}: ViewGroupDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMembers =
    group?.members.filter(member => {
      if (!searchQuery) return true;

      return (
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }) || [];

  if (!group) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{group.name}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => onEditClick(group.id)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            Created on {new Date().toLocaleDateString()} • {group.memberCount}{" "}
            members
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-around py-2">
          <Button
            variant="ghost"
            className="flex flex-col h-auto py-2"
            onClick={() => onAddMembersClick(group.id)}
          >
            <UserPlus className="h-5 w-5 mb-1" />
            <span className="text-xs">Add</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col h-auto py-2"
            onClick={() => onInviteToEventClick(group.id)}
          >
            <BellRing className="h-5 w-5 mb-1" />
            <span className="text-xs">Invite</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col h-auto py-2"
            onClick={() => onShareGroupClick(group.id)}
          >
            <Share className="h-5 w-5 mb-1" />
            <span className="text-xs">Share</span>
          </Button>
          <Button variant="ghost" className="flex flex-col h-auto py-2">
            <MessageSquare className="h-5 w-5 mb-1" />
            <span className="text-xs">Message</span>
          </Button>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="relative">
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>

          <div className="text-sm font-medium flex justify-between items-center">
            <span>Members</span>
            <span className="text-xs text-gray-500">
              {filteredMembers.length} of {group.memberCount}
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {filteredMembers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchQuery
                  ? "No members match your search"
                  : "This group has no members"}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredMembers.map(member => (
                  <div key={member.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.imageUrl} alt={member.name} />
                        <AvatarFallback>
                          <User className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium truncate">
                            {member.name}
                          </h4>
                          {member.isOnline ? (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-600 border-green-200"
                            >
                              Online
                            </Badge>
                          ) : (
                            <span className="text-xs text-gray-500 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatTimeAgo(member.lastActive)}
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-500 truncate">
                          @{member.username}
                        </p>

                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span className="truncate">{member.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewGroupDialog;
