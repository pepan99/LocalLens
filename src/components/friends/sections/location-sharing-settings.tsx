"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Group, User } from "lucide-react";
import { useState } from "react";
import {
  FriendGroup,
  LocationSharingSettingsType as LocationSettings,
} from "../types";

interface LocationSharingSettingsProps {
  settings: LocationSettings;
  groups: FriendGroup[];
  onSettingsChanged: (settings: LocationSettings) => void;
  onSaveSettings: (settings: LocationSettings) => void;
}

const LocationSharingSettings = ({
  settings: initialSettings,
  groups,
  onSettingsChanged,
  onSaveSettings,
}: LocationSharingSettingsProps) => {
  const [settings, setSettings] = useState<LocationSettings>(initialSettings);

  const handleSettingChange = <K extends keyof LocationSettings>(
    key: K,
    value: LocationSettings[K],
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChanged(newSettings);
  };

  const toggleGroupSharing = (groupId: string) => {
    const newShareWithGroups = settings.shareWithGroups.includes(groupId)
      ? settings.shareWithGroups.filter(id => id !== groupId)
      : [...settings.shareWithGroups, groupId];

    handleSettingChange("shareWithGroups", newShareWithGroups);
  };

  const handleResetToDefault = () => {
    const defaultSettings: LocationSettings = {
      enabled: true,
      shareWithAllFriends: false,
      shareWithGroups: [],
      locationHistory: false,
      locationPrecision: true,
      backgroundTracking: false,
    };
    setSettings(defaultSettings);
    onSettingsChanged(defaultSettings);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Location Sharing Settings</CardTitle>
        <CardDescription>
          Manage how you share your location with friends on LocalLens
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base font-medium">Share My Location</h3>
            <p className="text-sm text-gray-500">
              Allow friends to see your location on the map
            </p>
          </div>
          <Switch
            checked={settings.enabled}
            onCheckedChange={value => handleSettingChange("enabled", value)}
          />
        </div>

        <Separator />

        {settings.enabled && (
          <>
            <div className="space-y-4">
              <h3 className="text-base font-medium">Share With</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-gray-500" />
                    <span>All Friends</span>
                  </div>
                  <Switch
                    checked={settings.shareWithAllFriends}
                    onCheckedChange={value =>
                      handleSettingChange("shareWithAllFriends", value)
                    }
                  />
                </div>
                {groups.map(group => (
                  <div
                    key={group.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Group className="h-5 w-5 text-gray-500" />
                      <span>{group.name}</span>
                    </div>
                    <Switch
                      checked={settings.shareWithGroups.includes(group.id)}
                      onCheckedChange={() => toggleGroupSharing(group.id)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-base font-medium">Privacy Settings</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium">Location History</h4>
                    <p className="text-xs text-gray-500">
                      Keep history of your location
                    </p>
                  </div>
                  <Switch
                    checked={settings.locationHistory}
                    onCheckedChange={value =>
                      handleSettingChange("locationHistory", value)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium">Location Precision</h4>
                    <p className="text-xs text-gray-500">
                      Share exact location vs approximate area
                    </p>
                  </div>
                  <Switch
                    checked={settings.locationPrecision}
                    onCheckedChange={value =>
                      handleSettingChange("locationPrecision", value)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium">Background Tracking</h4>
                    <p className="text-xs text-gray-500">
                      Update location even when app is closed
                    </p>
                  </div>
                  <Switch
                    checked={settings.backgroundTracking}
                    onCheckedChange={value =>
                      handleSettingChange("backgroundTracking", value)
                    }
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2 bg-gray-50 px-6 py-4">
        <Button variant="outline" onClick={handleResetToDefault}>
          Reset to Default
        </Button>
        <Button onClick={() => onSaveSettings(settings)}>Save Settings</Button>
      </CardFooter>
    </Card>
  );
};

export default LocationSharingSettings;
