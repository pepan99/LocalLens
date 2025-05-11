import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { events } from "./events";
import { users } from "./users";

// Enum for RSVP Status
export enum RSVPStatusEnum {
  GOING = "going",
  MAYBE = "maybe",
  NOT_GOING = "not_going",
  NO_RESPONSE = "no_response",
}

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
