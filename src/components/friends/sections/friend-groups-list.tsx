"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, MoreVertical, Plus, User } from "lucide-react";
import { FriendGroup } from "../types";

interface FriendGroupsListProps {
  groups: FriendGroup[];
  onViewGroup: (groupId: string) => void;
  onAddMembersToGroup: (groupId: string) => void;
  onEditGroup: (groupId: string) => void;
  onDeleteGroup: (groupId: string) => void;
  onInviteGroupToEvent: (groupId: string) => void;
  onCreateGroupClick: () => void;
}

const FriendGroupsList = ({
  groups,
  onViewGroup,
  onAddMembersToGroup,
  onEditGroup,
  onDeleteGroup,
  onInviteGroupToEvent,
  onCreateGroupClick,
}: FriendGroupsListProps) => {
  if (groups.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <User className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium">No friend groups</h3>
        <p className="mt-1 text-gray-500">
          Create a group to organize your friends
        </p>
        <Button className="mt-4" onClick={onCreateGroupClick}>
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {groups.map(group => (
        <Card key={group.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{group.name}</CardTitle>
                <p className="text-sm text-gray-500">
                  {group.memberCount} members
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onViewGroup(group.id)}>
                    View All Members
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onAddMembersToGroup(group.id)}
                  >
                    Add Members
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEditGroup(group.id)}>
                    Edit Group
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => onDeleteGroup(group.id)}
                  >
                    Delete Group
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="flex -space-x-2 overflow-hidden">
              {group.members.map(member => (
                <Avatar
                  key={member.id}
                  className="h-8 w-8 border-2 border-white"
                >
                  <AvatarImage src={member.imageUrl} alt={member.name} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              ))}
              {group.memberCount > group.members.length && (
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 border-2 border-white">
                  <span className="text-xs font-medium">
                    +{group.memberCount - group.members.length}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 px-4 py-3 flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddMembersToGroup(group.id)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => onInviteGroupToEvent(group.id)}
            >
              <Bell className="h-4 w-4 mr-1" />
              Invite to Event
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default FriendGroupsList;
