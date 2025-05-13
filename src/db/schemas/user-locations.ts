import { sql } from "drizzle-orm";
import { real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./users";

export const userLocation = sqliteTable("user_location", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  updatedAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
