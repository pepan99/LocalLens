import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { events } from "./events";
import { users } from "./users";

// Enum for RSVP Status
export enum RSVPStatusEnum {
  GOING = "going",
  MAYBE = "maybe",
  NOT_GOING = "not_going",
  NO_RESPONSE = "no_response",
}

export const eventAttendance = sqliteTable("event_attendance", {
  eventId: text("event_id")
    .notNull()
    .references(() => events.id),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  status: text("status").notNull(),
  guests: integer("guests").default(0).notNull(),
  note: text("note"),
});
