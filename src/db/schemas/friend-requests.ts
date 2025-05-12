import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./users";

export const friendRequests = sqliteTable("friend_requests", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  fromUserId: text("from_user_id")
    .notNull()
    .references(() => users.id),
  toUserId: text("to_user_id")
    .notNull()
    .references(() => users.id),
  status: text("status") // "pending" | "accepted" | "rejected"
    .notNull()
    .default("pending"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});
