import { auth } from "@/auth";
import { FriendGroup } from "@/components/friends/types";
import { db } from "@/db";
import { friendGroupMembers } from "@/db/schemas/friend-group-members";
import { friendGroups } from "@/db/schemas/friend-groups";
import { users } from "@/db/schemas/users";
import { eq } from "drizzle-orm";
import { mapToFriend } from "..";

export const getGroups = async (): Promise<FriendGroup[]> => {
  const session = await auth();
  if (!session?.user?.id) return [];

  const rows = await db
    .select({
      groupId: friendGroups.id,
      groupName: friendGroups.name,
      ownerId: friendGroups.ownerId,
      userId: friendGroupMembers.userId,
    })
    .from(friendGroups)
    .innerJoin(
      friendGroupMembers,
      eq(friendGroupMembers.groupId, friendGroups.id),
    )
    .where(eq(friendGroups.ownerId, session.user.id));

  const groupsMap: Record<string, FriendGroup> = {};

  for (const row of rows) {
    if (!groupsMap[row.groupId]) {
      groupsMap[row.groupId] = {
        id: row.groupId,
        name: row.groupName,
        memberCount: 0,
        members: [],
      };
    }

    // Fetch member details
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, row.userId));

    if (user) {
      groupsMap[row.groupId].members.push(mapToFriend(user));
      groupsMap[row.groupId].memberCount++;
    }
  }

  return Object.values(groupsMap);
};
