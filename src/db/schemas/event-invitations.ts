import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { events } from "./events";
import { users } from "./users";

export const eventInvitations = sqliteTable("event_invitations", {
  eventId: text("event_id")
    .notNull()
    .references(() => events.id),
  invitedUserId: text("invited_user_id")
    .notNull()
    .references(() => users.id),
});
