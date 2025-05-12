import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { places } from "./places";
import { users } from "./users";

export const reviews = sqliteTable("reviews", {
  id: text("id")
    .primaryKey()
    .references(() => places.id),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  placeId: text("place_id").notNull(),
  rating: text("rating").notNull(),
  comment: text("comment"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});
