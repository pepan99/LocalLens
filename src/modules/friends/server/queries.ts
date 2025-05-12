import { auth } from "@/auth";
import { Friend, FriendRequest } from "@/components/friends/types";
import { db } from "@/db";
import { friendRequests, friends } from "@/db/schemas/schema";
import { users } from "@/db/schemas/users";
import { mapToFriend, mapToFriendRequest } from "@/modules/friends";
import { and, eq, or, sql } from "drizzle-orm";

export const getFriends = async (): Promise<Friend[]> => {
  const session = await auth();
  if (!session?.user?.id) return [];

  const rows = await db
    .select({
      user: users,
    })
    .from(friends)
    .innerJoin(users, eq(friends.friendId, users.id))
    .where(eq(friends.userId, session.user.id));

  return rows.map(({ user }) => mapToFriend(user));
};

export const getPendingFriendRequests = async (): Promise<FriendRequest[]> => {
  const session = await auth();
  if (!session?.user?.id) return [];

  const data = await db
    .select({
      request: friendRequests,
      user: users,
      direction: sql`CASE 
        WHEN ${friendRequests.fromUserId} = ${session.user.id} THEN 'outgoing' 
        ELSE 'incoming' 
      END`.as("direction"),
    })
    .from(friendRequests)
    .innerJoin(
      users,
      sql`CASE 
        WHEN ${friendRequests.fromUserId} = ${session.user.id} THEN ${friendRequests.toUserId} 
        ELSE ${friendRequests.fromUserId} 
      END = ${users.id}`,
    )
    .where(
      and(
        or(
          eq(friendRequests.fromUserId, session.user.id),
          eq(friendRequests.toUserId, session.user.id),
        ),
        eq(friendRequests.status, "pending"),
      ),
    );

  return data.map(({ request, user, direction }) =>
    mapToFriendRequest({
      request,
      user,
      direction: direction === "outgoing" ? "outgoing" : "incoming",
    }),
  );
};
