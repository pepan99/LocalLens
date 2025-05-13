import { EventInvitationNotification } from "@/components/notifications/utils";

export type RawEventInvitation = {
  id: string;
  title: string;
  date: Date | string | number;
  location: string | null;
  description: string;
  attendees: number;
  seen: boolean | number | null;
};

export const mapToEventInvitationNotification = (
  event: RawEventInvitation,
): EventInvitationNotification => ({
  id: event.id,
  title: event.title,
  date: new Date(event.date).toISOString(),
  location: event.location ?? "Unknown location",
  description: event.description,
  attendees: event.attendees,
  seen: Boolean(event.seen),
});
