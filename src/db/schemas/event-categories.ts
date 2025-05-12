import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { categories } from "./categories";
import { events } from "./events";

export const eventCategories = sqliteTable("event_categories", {
  eventId: text("event_id")
    .notNull()
    .references(() => events.id),
  categoryId: text("category_id")
    .notNull()
    .references(() => categories.id),
});
