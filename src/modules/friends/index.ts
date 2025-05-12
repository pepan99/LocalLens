import { Friend, FriendRequest } from "@/components/friends/types";
import { friendRequests } from "@/db/schemas/schema";
import { users } from "@/db/schemas/users";
import { InferSelectModel } from "drizzle-orm";

export const mapToFriendRequest = ({
  request,
  user,
  direction,
}: {
  request: InferSelectModel<typeof friendRequests>;
  user: InferSelectModel<typeof users>;
  direction: "incoming" | "outgoing";
}): FriendRequest => {
  return {
    id: request.id,
    name: user.name ?? "Unknown",
    username: user.email?.split("@")[0] ?? "unknown",
    imageUrl: user.image ?? "",
    location: "Unknown",
    sentAt: new Date(request.createdAt ?? Date.now()),
    direction,
  };
};

export const mapToFriend = (user: InferSelectModel<typeof users>): Friend => {
  return {
    id: user.id,
    name: user.name ?? "Unknown",
    username: user.email?.split("@")[0] ?? "unknown",
    imageUrl: user.image ?? "",
    location: "Unknown",
    isOnline: false,
    lastActive: new Date(),
    isSharingLocation: false,
    coordinates: null,
  };
};
