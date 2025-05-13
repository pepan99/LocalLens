export type UserLocation = {
  userId: string;
  location: [number, number];
  updatedAt: Date;
};

export type UserWithLocation = {
  id: string;
  name: string;
  imageUrl: string | null;
  coordinates: [number, number] | null;
  lastUpdated: Date | null;
};

export type LocationSharingConfig = {
  isSharingLocation: boolean;
};
