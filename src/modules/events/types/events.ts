export type EventType = {
  id: string;
  creatorId: string;
  title: string;
  time: string;
  category: string;
  date: Date;
  location: string;
  description: string;
  capacity: number;
  isPrivate: boolean;
  latitude: number;
  longitude: number;
  attendees: number;
  rating: number;
  imageUrl: string | null;
  rsvp: RSVP | null;
};

type RSVP = {
  status: RSVPStatusEnum;
  guests: number;
  note: string | null;
};

// RSVP Status Types
export enum RSVPStatusEnum {
  GOING = "going",
  MAYBE = "maybe",
  NOT_GOING = "not_going",
  NO_RESPONSE = "no_response",
}

export type AttendingUser = {
  id: string;
  name: string;
  image: string | null;
  rsvp: RSVP;
};
