"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Search, User } from "lucide-react";
import { useState } from "react";
import { Friend, FriendGroup } from "./types";

interface AddMembersDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  group: FriendGroup | null;
  friends: Friend[];
  onAddMembers: (groupId: string, friendIds: string[]) => void;
}

const AddMembersDialog = ({
  isOpen,
  onOpenChange,
  group,
  friends,
  onAddMembers,
}: AddMembersDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([]);

  // Reset selections when dialog opens or group changes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSearchQuery("");
      setSelectedFriendIds([]);
    }
    onOpenChange(open);
  };

  const handleAddMembers = () => {
    if (group && selectedFriendIds.length > 0) {
      onAddMembers(group.id, selectedFriendIds);
      // Reset form
      setSearchQuery("");
      setSelectedFriendIds([]);
    }
  };

  const toggleFriendSelection = (friendId: string) => {
    if (selectedFriendIds.includes(friendId)) {
      setSelectedFriendIds(selectedFriendIds.filter(id => id !== friendId));
    } else {
      setSelectedFriendIds([...selectedFriendIds, friendId]);
    }
  };

  // Filter friends that are not already in the group
  const availableFriends = friends.filter(friend => {
    // Skip if the friend is already in the group
    if (group?.members.some(member => member.id === friend.id)) {
      return false;
    }

    // Apply search filter if there's a search query
    if (searchQuery) {
      return (
        friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return true;
  });

  if (!group) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Members to {group.name}</DialogTitle>
          <DialogDescription>
            Select friends to add to this group
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="relative">
            <Input
              placeholder="Search friends..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Select Friends</span>
              <span className="text-xs text-gray-500">
                {selectedFriendIds.length} selected
              </span>
            </div>

            {availableFriends.length === 0 ? (
              <div className="border rounded-md p-4 text-center text-gray-500">
                {searchQuery
                  ? "No friends match your search"
                  : "All your friends are already in this group"}
              </div>
            ) : (
              <div className="border rounded-md max-h-60 overflow-y-auto">
                {availableFriends.map(friend => (
                  <div
                    key={friend.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={friend.imageUrl} alt={friend.name} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{friend.name}</div>
                        <div className="text-xs text-gray-500">
                          @{friend.username}
                        </div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedFriendIds.includes(friend.id)}
                      onChange={() => toggleFriendSelection(friend.id)}
                      className="h-4 w-4 rounded border-gray-300 text-primary"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAddMembers}
            disabled={selectedFriendIds.length === 0}
          >
            Add to Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMembersDialog;
