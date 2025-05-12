import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./users";

export const friendGroups = sqliteTable("friend_groups", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id),
});
