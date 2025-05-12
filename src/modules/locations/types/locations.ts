export type UserLocation = {
  userId: string;
  location: [number, number];
  updatedAt: Date;
};

export type UserWithLocation = {
  id: string;
  name: string;
  imageUrl?: string;
  coordinates: [number, number];
  lastUpdated?: Date;
};
