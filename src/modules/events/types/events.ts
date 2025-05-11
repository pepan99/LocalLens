export type EventType = {
  id: string;
  creatorId: string;
  title: string;
  time: string;
  category: string;
  date: string;
  location: string;
  description: string;
  capacity: string;
  isEventPrivate: boolean;
  coordinates: [number, number];
  attendees: number;
  rating: number;
};
