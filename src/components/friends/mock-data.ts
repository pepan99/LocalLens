import {
  Friend,
  FriendGroup,
  FriendRequest,
  type LocationSharingSettingsType,
} from "./types";

// Mock data for friends
export const MOCK_FRIENDS: Friend[] = [
  {
    id: "1",
    name: "Marie Novotná",
    username: "marie_novotna",
    imageUrl: "/placeholder-user-1.jpg",
    location: "Brno, Czech Republic",
    isOnline: true,
    lastActive: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    isSharingLocation: true,
    coordinates: [49.197, 16.608],
  },
  {
    id: "2",
    name: "Jan Svoboda",
    username: "jan_svoboda",
    imageUrl: "/placeholder-user-2.jpg",
    location: "Prague, Czech Republic",
    isOnline: false,
    lastActive: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    isSharingLocation: true,
    coordinates: [49.199, 16.599],
  },
  {
    id: "3",
    name: "Eva Dvořáková",
    username: "eva_dvorakova",
    imageUrl: "/placeholder-user-3.jpg",
    location: "Brno, Czech Republic",
    isOnline: false,
    lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    isSharingLocation: false,
    coordinates: null,
  },
  {
    id: "6",
    name: "Tomáš Horáček",
    username: "tomas_horacek",
    imageUrl: "/placeholder-user-6.jpg",
    location: "Brno, Czech Republic",
    isOnline: true,
    lastActive: new Date(),
    isSharingLocation: true,
    coordinates: [49.193, 16.603],
  },
  {
    id: "7",
    name: "Adéla Krejčí",
    username: "adela_krejci",
    imageUrl: "/placeholder-user-7.jpg",
    location: "Olomouc, Czech Republic",
    isOnline: false,
    lastActive: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    isSharingLocation: false,
    coordinates: null,
  },
];

// Mock data for pending friend requests
export const MOCK_PENDING_REQUESTS: FriendRequest[] = [
  {
    id: "4",
    name: "Petr Novák",
    username: "petr_novak",
    imageUrl: "/placeholder-user-4.jpg",
    location: "Ostrava, Czech Republic",
    sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    direction: "incoming",
  },
  {
    id: "5",
    name: "Lucie Procházková",
    username: "lucie_prochazkova",
    imageUrl: "/placeholder-user-5.jpg",
    location: "Brno, Czech Republic",
    sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    direction: "outgoing",
  },
  {
    id: "8",
    name: "Martin Kovář",
    username: "martin_kovar",
    imageUrl: "/placeholder-user-8.jpg",
    location: "Brno, Czech Republic",
    sentAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    direction: "incoming",
  },
];

// Mock data for friend groups
export const MOCK_FRIEND_GROUPS: FriendGroup[] = [
  {
    id: "1",
    name: "Close Friends",
    memberCount: 5,
    members: MOCK_FRIENDS.slice(0, 2),
  },
  {
    id: "2",
    name: "Work Colleagues",
    memberCount: 8,
    members: MOCK_FRIENDS.slice(1, 3),
  },
  {
    id: "3",
    name: "Hiking Buddies",
    memberCount: 4,
    members: MOCK_FRIENDS.slice(0, 1),
  },
];

// Mock location sharing settings
export const MOCK_LOCATION_SETTINGS: LocationSharingSettingsType = {
  enabled: true,
  shareWithAllFriends: false,
  shareWithGroups: ["1"],
  locationHistory: false,
  locationPrecision: true,
  backgroundTracking: false,
};
