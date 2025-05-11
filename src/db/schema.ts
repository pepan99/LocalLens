import { sql } from "drizzle-orm";
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { AdapterAccountType } from "next-auth/adapters";

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

/* Auth.js schemas */
export const users = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
});

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  account => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  verificationToken => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  }),
);

export const authenticators = sqliteTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: integer("credentialBackedUp", {
      mode: "boolean",
    }).notNull(),
    transports: text("transports"),
  },
  authenticator => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  }),
);
