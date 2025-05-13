import { Friend } from "@/components/friends/types";
import { users } from "@/db/schemas/users";
import { InferSelectModel } from "drizzle-orm";

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
