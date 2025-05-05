import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const friends = sqliteTable("friends", {
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  friendId: text("friend_id")
    .notNull()
    .references(() => users.id),
});

export const friendGroups = sqliteTable("friend_groups", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id),
});

export const friendGroupMembers = sqliteTable("friend_group_members", {
  groupId: text("group_id")
    .notNull()
    .references(() => friendGroups.id),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
});

export const events = sqliteTable("events", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  location: text("location"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id),
  date: text("date").notNull(),
});

export const eventInvitations = sqliteTable("event_invitations", {
  eventId: text("event_id")
    .notNull()
    .references(() => events.id),
  invitedUserId: text("invited_user_id")
    .notNull()
    .references(() => users.id),
});

export const eventAttendance = sqliteTable("event_attendance", {
  eventId: text("event_id")
    .notNull()
    .references(() => events.id),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  status: text("status").notNull(),
});

export const places = sqliteTable("places", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address"),
  latitude: text("latitude"),
  longitude: text("longitude"),
});

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

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const eventCategories = sqliteTable("event_categories", {
  eventId: text("event_id")
    .notNull()
    .references(() => events.id),
  categoryId: text("category_id")
    .notNull()
    .references(() => categories.id),
});

export const userLocation = sqliteTable("user_location", {
  userId: text("user_id")
    .primaryKey()
    .references(() => places.id),
  latitude: text("latitude"),
  longitude: text("longitude"),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});
