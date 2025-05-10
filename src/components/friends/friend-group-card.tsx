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
import {
  Bell,
  MoreVertical,
  PenSquare,
  Plus,
  Trash,
  Users,
} from "lucide-react";
import { FriendGroup } from "./types";

interface FriendGroupCardProps {
  group: FriendGroup;
  onEditGroup: (groupId: string) => void;
  onDeleteGroup: (groupId: string) => void;
  onAddMembers: (groupId: string) => void;
  onViewMembers: (groupId: string) => void;
}

const FriendGroupCard = ({
  group,
  onEditGroup,
  onDeleteGroup,
  onAddMembers,
  onViewMembers,
}: FriendGroupCardProps) => {
  return (
    <Card className="overflow-hidden border hover:border-gray-300 transition-colors duration-300 hover:shadow-sm">
      <CardHeader className="pb-3 px-4 pt-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-medium group-hover:text-primary transition-colors">
              {group.name}
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              <span className="font-medium">{group.memberCount}</span>{" "}
              {group.memberCount === 1 ? "member" : "members"}
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
              <DropdownMenuItem onClick={() => onViewMembers(group.id)}>
                <Users className="mr-2 h-4 w-4" />
                <span>View All Members</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAddMembers(group.id)}>
                <Plus className="mr-2 h-4 w-4" />
                <span>Add Members</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEditGroup(group.id)}>
                <PenSquare className="mr-2 h-4 w-4" />
                <span>Edit Group</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDeleteGroup(group.id)}
                className="text-red-600 focus:text-red-700 focus:bg-red-50"
              >
                <Trash className="mr-2 h-4 w-4" />
                <span>Delete Group</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4">
        <div className="flex -space-x-2 overflow-hidden">
          {group.members.map((member, index) => (
            <Avatar
              key={member.id}
              className={`h-9 w-9 border-2 border-white transition-transform ${
                index < 3 ? "hover:translate-y-[-5px]" : ""
              }`}
            >
              <AvatarImage src={member.imageUrl} alt={member.name} />
              <AvatarFallback className="bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700">
                {member.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ))}

          {group.memberCount > group.members.length && (
            <Button
              className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-200 border-2 border-white shadow hover:bg-gray-300 transition-all cursor-pointer"
              onClick={() => onViewMembers(group.id)}
            >
              <span className="text-xs font-medium text-gray-700">
                +{group.memberCount - group.members.length}
              </span>
            </Button>
          )}

          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full ml-2 border-dashed border-gray-300 bg-white hover:bg-gray-50"
            onClick={() => onAddMembers(group.id)}
          >
            <Plus className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      </CardContent>

      <CardFooter className="bg-gray-50 px-4 py-3 flex justify-between items-center">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => onViewMembers(group.id)}
        >
          <Users className="h-4 w-4" />
          View
        </Button>

        <Button
          variant="default"
          size="sm"
          className="gap-1.5 bg-indigo-600 hover:bg-indigo-700"
        >
          <Bell className="h-4 w-4" />
          Invite to Event
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FriendGroupCard;
