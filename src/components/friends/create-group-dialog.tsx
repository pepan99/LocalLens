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
import { User } from "lucide-react";
import { useState } from "react";
import { Friend } from "./types";

interface CreateGroupDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  friends: Friend[];
  onCreateGroup: (name: string, friendIds: string[]) => void;
}

const CreateGroupDialog = ({
  isOpen,
  onOpenChange,
  friends,
  onCreateGroup,
}: CreateGroupDialogProps) => {
  const [groupName, setGroupName] = useState("");
  const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([]);

  const handleCreateGroup = () => {
    onCreateGroup(groupName, selectedFriendIds);
    // Reset form
    setGroupName("");
    setSelectedFriendIds([]);
  };

  const toggleFriendSelection = (friendId: string) => {
    if (selectedFriendIds.includes(friendId)) {
      setSelectedFriendIds(selectedFriendIds.filter(id => id !== friendId));
    } else {
      setSelectedFriendIds([...selectedFriendIds, friendId]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Friend Group</DialogTitle>
          <DialogDescription>
            Create a new group to organize your friends and share with them
            easily.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label htmlFor="group-name" className="text-sm font-medium">
              Group Name
            </label>
            <Input
              id="group-name"
              placeholder="e.g. Close Friends, Work Colleagues"
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium">Select Friends</span>
            <div className="border rounded-md max-h-60 overflow-y-auto">
              {friends.map(friend => (
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
                    <span>{friend.name}</span>
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
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateGroup}
            disabled={!groupName.trim() || selectedFriendIds.length === 0}
          >
            Create Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog;
