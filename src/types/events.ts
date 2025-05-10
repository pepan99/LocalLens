export type EventType = {
  id: string;
  title: string;
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
