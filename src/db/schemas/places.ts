import { sql } from "drizzle-orm";
import { primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const amenities = sqliteTable("amenities", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const placeAmenities = sqliteTable(
  "place_amenities",
  {
    placeId: text("place_id")
      .notNull()
      .references(() => places.id, { onDelete: "cascade" }),
    amenityId: text("amenity_id")
      .notNull()
      .references(() => amenities.id, { onDelete: "cascade" }),
  },
  table => [primaryKey({ columns: [table.placeId, table.amenityId] })],
);

export const openingHours = sqliteTable("opening_hours", {
  id: text("id").primaryKey(),
  placeId: text("place_id")
    .notNull()
    .references(() => places.id, { onDelete: "cascade" }),
  day: text("day").notNull(),
  hours: text("hours").notNull(),
});

export const placeCategories = sqliteTable("place_categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
});

export const placeCategoryRelations = sqliteTable(
  "place_category_relations",
  {
    placeId: text("place_id")
      .notNull()
      .references(() => places.id, { onDelete: "cascade" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => placeCategories.id, { onDelete: "cascade" }),
  },
  table => [primaryKey({ columns: [table.placeId, table.categoryId] })],
);

export const places = sqliteTable("places", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  description: text("description"),
  website: text("website"),
  phone: text("phone"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});
