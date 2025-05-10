"use client";

import { Button } from "@/components/ui/button";
import { User, UserPlus } from "lucide-react";
import FriendCard from "../friend-card";
import { Friend } from "../types";

interface FriendsListProps {
  friends: Friend[];
  filteredFriends: Friend[];
  searchQuery: string;
  onRemoveFriend: (friendId: string) => void;
  onViewProfile: (friendId: string) => void;
  onAddFriendClick: () => void;
}

const FriendsList = ({
  friends,
  filteredFriends,
  searchQuery,
  onRemoveFriend,
  onViewProfile,
  onAddFriendClick,
}: FriendsListProps) => {
  if (filteredFriends.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <User className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium">
          {searchQuery ? "No friends found" : "No friends yet"}
        </h3>
        <p className="mt-1 text-gray-500">
          {searchQuery
            ? "Try adjusting your search or add new friends"
            : "Start by adding friends to connect with"}
        </p>
        <Button className="mt-4" onClick={onAddFriendClick}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Friend
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredFriends.map(friend => (
        <FriendCard
          key={friend.id}
          friend={friend}
          onRemoveFriend={onRemoveFriend}
          onViewProfile={onViewProfile}
        />
      ))}
    </div>
  );
};

export default FriendsList;
