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
import { User, X } from "lucide-react";
import { useState } from "react";
import { FriendGroup } from "./types";

interface EditGroupDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  group: FriendGroup | null;
  onEditGroup: (groupId: string, name: string) => void;
  onRemoveMember: (groupId: string, memberId: string) => void;
}

const EditGroupDialog = ({
  isOpen,
  onOpenChange,
  group,
  onEditGroup,
  onRemoveMember,
}: EditGroupDialogProps) => {
  const [groupName, setGroupName] = useState("");

  // Update local state when group changes
  const handleOpenChange = (open: boolean) => {
    if (open && group) {
      setGroupName(group.name);
    }
    onOpenChange(open);
  };

  const handleSaveChanges = () => {
    if (group && groupName.trim()) {
      onEditGroup(group.id, groupName.trim());
      onOpenChange(false);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    if (group) {
      onRemoveMember(group.id, memberId);
    }
  };

  if (!group) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Group</DialogTitle>
          <DialogDescription>
            Modify group name and manage members
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label htmlFor="group-name" className="text-sm font-medium">
              Group Name
            </label>
            <Input
              id="group-name"
              placeholder="Enter group name"
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Members</span>
              <span className="text-xs text-gray-500">
                {group.members.length} member
                {group.members.length !== 1 ? "s" : ""}
              </span>
            </div>

            {group.members.length === 0 ? (
              <div className="border rounded-md p-4 text-center text-gray-500">
                This group has no members
              </div>
            ) : (
              <div className="border rounded-md max-h-60 overflow-y-auto">
                {group.members.map(member => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.imageUrl} alt={member.name} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-xs text-gray-500">
                          @{member.username}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-red-50 hover:text-red-600"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveChanges}
            disabled={!groupName.trim() || groupName === group.name}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditGroupDialog;
