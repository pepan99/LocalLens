import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./users";

export const friends = sqliteTable("friends", {
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  friendId: text("friend_id")
    .notNull()
    .references(() => users.id),
});
