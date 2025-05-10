"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { FriendGroup } from "./types";

interface DeleteGroupDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  group: FriendGroup | null;
  onConfirmDelete: (groupId: string) => void;
}

const DeleteGroupDialog = ({
  isOpen,
  onOpenChange,
  group,
  onConfirmDelete,
}: DeleteGroupDialogProps) => {
  const handleDelete = () => {
    if (group) {
      onConfirmDelete(group.id);
      onOpenChange(false);
    }
  };

  if (!group) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-600">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Delete Group
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the group &quot;{group.name}&quot;?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm">
            This action cannot be undone. This will permanently delete the group
            and remove all member associations.
          </p>

          {group.members.length > 0 && (
            <div className="mt-4 p-3 bg-amber-50 text-amber-800 rounded-md text-sm">
              <p>
                <strong>Note:</strong> This group has {group.members.length}{" "}
                members. Deleting the group will not remove these people from
                your friends list, but they will no longer be part of this
                group.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteGroupDialog;
