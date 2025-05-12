import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { places } from "./places";

export const userLocation = sqliteTable("user_location", {
  userId: text("user_id")
    .primaryKey()
    .references(() => places.id),
  latitude: text("latitude"),
  longitude: text("longitude"),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});
