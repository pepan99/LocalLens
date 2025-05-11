import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./users";

export const events = sqliteTable("events", {
  id: text("id").primaryKey(),
  creatorId: text("creator_id")
    .notNull()
    .references(() => users.id),
  title: text("title").notNull(),
  time: text("time").notNull(),
  date: integer("date", { mode: "timestamp" }).notNull(),
  location: text("location"),
  description: text("description").notNull(),
  category: text("category").notNull(),
  capacity: integer("capacity").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  isPrivate: integer("is_private", { mode: "boolean" })
    .notNull()
    .default(false),
  imageUrl: text("image_url"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
});
