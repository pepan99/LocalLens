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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search, Share } from "lucide-react";
import { useState } from "react";

interface AddFriendDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSendRequest: (usernameOrEmail: string) => void;
}

const AddFriendDialog = ({
  isOpen,
  onOpenChange,
  onSendRequest,
}: AddFriendDialogProps) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");

  const handleSendRequest = () => {
    if (usernameOrEmail.trim()) {
      onSendRequest(usernameOrEmail.trim());
      setUsernameOrEmail("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a Friend</DialogTitle>
          <DialogDescription>
            Send a friend request to connect with someone on LocalLens
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username or Email
            </label>
            <div className="relative">
              <Input
                id="username"
                placeholder="e.g. john_doe or john@example.com"
                className="pl-10"
                value={usernameOrEmail}
                onChange={e => setUsernameOrEmail(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <Button
            className="w-full"
            onClick={handleSendRequest}
            disabled={!usernameOrEmail.trim()}
          >
            Send Friend Request
          </Button>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-sm font-medium">QR Code</h3>
            <p className="text-sm text-gray-500">
              Have your friend scan your unique QR code to connect
            </p>
            <div className="bg-gray-100 aspect-square rounded-lg flex items-center justify-center p-4">
              <div className="w-48 h-48 bg-gray-300 rounded-md flex items-center justify-center">
                <p className="text-gray-600 text-sm">QR Code Placeholder</p>
              </div>
            </div>
            <div className="flex justify-center">
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share Profile Link
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-end mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddFriendDialog;
