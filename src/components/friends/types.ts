export type Friend = {
  id: string;
  name: string;
  username: string;
  imageUrl: string;
  location: string;
  isOnline: boolean;
  lastActive: Date;
  isSharingLocation: boolean;
  coordinates: [number, number] | null;
};

export type FriendRequest = {
  id: string;
  name: string;
  username: string;
  imageUrl: string;
  location: string;
  sentAt: Date;
  direction: "incoming" | "outgoing";
};

export type FriendGroup = {
  id: string;
  name: string;
  memberCount: number;
  members: Friend[];
};

export type LocationSharingSettingsType = {
  enabled: boolean;
  shareWithAllFriends: boolean;
  shareWithGroups: string[];
  locationHistory: boolean;
  locationPrecision: boolean;
  backgroundTracking: boolean;
};
