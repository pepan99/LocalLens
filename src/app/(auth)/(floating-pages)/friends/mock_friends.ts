import { type LocationSharingSettingsType } from "@/components/friends/types";

// Mock data for location sharing settings
export const MOCK_LOCATION_SETTINGS: LocationSharingSettingsType = {
  enabled: true,
  shareWithAllFriends: false,
  shareWithGroups: ["1"], // Share with "Close Friends" group
  locationHistory: false,
  locationPrecision: true,
  backgroundTracking: false,
};
