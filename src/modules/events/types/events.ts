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
  isEventPrivate: boolean;
  coordinates: [number, number];
  attendees: number;
  rating: number;
  imageUrl: string | null;
};
