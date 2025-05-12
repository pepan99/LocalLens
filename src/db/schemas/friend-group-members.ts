import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { friendGroups } from "./friend-groups";
import { users } from "./users";

export const friendGroupMembers = sqliteTable("friend_group_members", {
  groupId: text("group_id")
    .notNull()
    .references(() => friendGroups.id),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
});
