"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Clock,
  Group,
  Locate,
  MapPin,
  Radiation,
  RadioTower,
  RotateCcw,
  Save,
  Target,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import { FriendGroup, type LocationSharingSettingsType } from "./types";

interface LocationSharingSettingsProps {
  settings: LocationSharingSettingsType;
  groups: FriendGroup[];
  onSaveSettings: (settings: LocationSharingSettingsType) => void;
}

const LocationSharingSettingsType = ({
  settings,
  groups,
  onSaveSettings,
}: LocationSharingSettingsProps) => {
  const [localSettings, setLocalSettings] =
    useState<LocationSharingSettingsType>(settings);
  const [hasChanges, setHasChanges] = useState(false);

  // Update a single setting
  const updateSetting = (
    key: keyof LocationSharingSettingsType,
    value: unknown,
  ) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value,
    }));
    setHasChanges(true);
  };

  // Handle toggling the group sharing
  const toggleGroupSharing = (groupId: string) => {
    setLocalSettings(prev => {
      const newShareWithGroups = prev.shareWithGroups.includes(groupId)
        ? prev.shareWithGroups.filter(id => id !== groupId)
        : [...prev.shareWithGroups, groupId];

      return {
        ...prev,
        shareWithGroups: newShareWithGroups,
      };
    });
    setHasChanges(true);
  };

  // Handle saving settings
  const handleSaveSettings = () => {
    onSaveSettings(localSettings);
    setHasChanges(false);
  };

  // Handle reset to defaults
  const handleResetToDefaults = () => {
    setLocalSettings({
      enabled: true,
      shareWithAllFriends: false,
      shareWithGroups: ["1"],
      locationHistory: false,
      locationPrecision: true,
      backgroundTracking: false,
    });
    setHasChanges(true);
  };

  return (
    <div className="space-y-6">
      <Card className="border-indigo-100 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl flex items-center gap-2 text-indigo-800">
                <MapPin className="h-5 w-5 text-indigo-600" />
                Location Sharing Settings
              </CardTitle>
              <CardDescription className="text-indigo-700 mt-1 opacity-90">
                Manage how you share your location with friends
              </CardDescription>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant={localSettings.enabled ? "default" : "outline"}
                    className={
                      localSettings.enabled
                        ? "bg-green-100 text-green-700 hover:bg-green-200 py-1 px-3"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 py-1 px-3"
                    }
                  >
                    {localSettings.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  {localSettings.enabled
                    ? "Your location is being shared according to your settings"
                    : "You are not sharing your location with anyone"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-5">
          {/* Master switch */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
            <div className="space-y-0.5">
              <h3 className="text-base font-medium flex items-center gap-1.5">
                <Locate className="h-4 w-4 text-indigo-600" />
                Share My Location
              </h3>
              <p className="text-sm text-gray-600">
                Allow friends to see your location on the map
              </p>
            </div>
            <Switch
              checked={localSettings.enabled}
              onCheckedChange={checked => updateSetting("enabled", checked)}
              className="data-[state=checked]:bg-indigo-600"
            />
          </div>

          {localSettings.enabled && (
            <>
              <Separator className="my-2" />

              {/* Who to share with */}
              <div className="space-y-4">
                <h3 className="text-base font-medium flex items-center gap-1.5 text-gray-800">
                  <Users className="h-4 w-4 text-indigo-600" />
                  Share With
                </h3>

                <div className="space-y-3 pl-1">
                  <div className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-md -mx-2 transition-colors">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-gray-500" />
                      <span className="font-medium text-gray-700">
                        All Friends
                      </span>
                    </div>
                    <Switch
                      checked={localSettings.shareWithAllFriends}
                      onCheckedChange={checked => {
                        updateSetting("shareWithAllFriends", checked);
                        // If turning on all friends, clear specific groups
                        if (checked) {
                          updateSetting("shareWithGroups", []);
                        }
                      }}
                      className="data-[state=checked]:bg-indigo-600"
                    />
                  </div>

                  {/* Only show groups if not sharing with all friends */}
                  {!localSettings.shareWithAllFriends && (
                    <div className="space-y-1 mt-2">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Friend Groups
                      </h4>
                      {groups.map(group => (
                        <div
                          key={group.id}
                          className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-md -mx-2 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Group className="h-5 w-5 text-gray-500" />
                            <span>{group.name}</span>
                            <Badge
                              variant="outline"
                              className="bg-gray-50 text-xs"
                            >
                              {group.memberCount}{" "}
                              {group.memberCount === 1 ? "member" : "members"}
                            </Badge>
                          </div>
                          <Switch
                            checked={localSettings.shareWithGroups.includes(
                              group.id,
                            )}
                            onCheckedChange={() => toggleGroupSharing(group.id)}
                            className="data-[state=checked]:bg-indigo-600"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <Separator className="my-2" />

              {/* Privacy settings */}
              <div className="space-y-4">
                <h3 className="text-base font-medium flex items-center gap-1.5 text-gray-800">
                  <Target className="h-4 w-4 text-indigo-600" />
                  Privacy Settings
                </h3>

                <div className="space-y-3 pl-1">
                  <HoverCard openDelay={200}>
                    <div className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-md -mx-2 transition-colors">
                      <HoverCardTrigger asChild>
                        <div className="space-y-0.5 cursor-help">
                          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-indigo-500" />
                            Location History
                          </h4>
                          <p className="text-xs text-gray-500">
                            Keep history of your location
                          </p>
                        </div>
                      </HoverCardTrigger>
                      <Switch
                        checked={localSettings.locationHistory}
                        onCheckedChange={checked =>
                          updateSetting("locationHistory", checked)
                        }
                        className="data-[state=checked]:bg-indigo-600"
                      />
                    </div>
                    <HoverCardContent className="w-80 text-sm">
                      When enabled, your location history will be saved,
                      allowing friends to see where you&apos;ve been recently.
                      This data is stored for up to 7 days.
                    </HoverCardContent>
                  </HoverCard>

                  <HoverCard openDelay={200}>
                    <div className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-md -mx-2 transition-colors">
                      <HoverCardTrigger asChild>
                        <div className="space-y-0.5 cursor-help">
                          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                            <Target className="h-4 w-4 text-indigo-500" />
                            Location Precision
                          </h4>
                          <p className="text-xs text-gray-500">
                            Share exact location vs approximate area
                          </p>
                        </div>
                      </HoverCardTrigger>
                      <Switch
                        checked={localSettings.locationPrecision}
                        onCheckedChange={checked =>
                          updateSetting("locationPrecision", checked)
                        }
                        className="data-[state=checked]:bg-indigo-600"
                      />
                    </div>
                    <HoverCardContent className="w-80 text-sm">
                      When enabled, your exact location will be shared. When
                      disabled, only an approximate area (within 1km) will be
                      shown to protect your privacy.
                    </HoverCardContent>
                  </HoverCard>

                  <HoverCard openDelay={200}>
                    <div className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-md -mx-2 transition-colors">
                      <HoverCardTrigger asChild>
                        <div className="space-y-0.5 cursor-help">
                          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                            <RadioTower className="h-4 w-4 text-indigo-500" />
                            Background Tracking
                          </h4>
                          <p className="text-xs text-gray-500">
                            Update location even when app is closed
                          </p>
                        </div>
                      </HoverCardTrigger>
                      <Switch
                        checked={localSettings.backgroundTracking}
                        onCheckedChange={checked =>
                          updateSetting("backgroundTracking", checked)
                        }
                        className="data-[state=checked]:bg-indigo-600"
                      />
                    </div>
                    <HoverCardContent className="w-80 text-sm">
                      When enabled, your location will continue to update even
                      when the app is closed. This may use additional battery
                      power but keeps your location up to date.
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </div>
            </>
          )}
        </CardContent>

        <CardFooter className="flex justify-between gap-2 bg-gray-50 px-6 py-4 border-t">
          <Button
            variant="outline"
            onClick={handleResetToDefaults}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Default
          </Button>
          <Button
            onClick={handleSaveSettings}
            disabled={!hasChanges}
            className={`gap-2 ${hasChanges ? "bg-green-600 hover:bg-green-700" : ""}`}
          >
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
        </CardFooter>
      </Card>

      {/* Additional information card */}
      <Card className="bg-blue-50 border-blue-100">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-blue-100 p-2 mt-1">
              <Radiation className="h-5 w-5 text-blue-600" />
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-blue-800">
                About Location Sharing
              </h3>
              <p className="text-sm text-blue-700">
                Your location is only shared with people you choose. You can
                change these settings or disable location sharing at any time.
                Location data is encrypted and not shared with third parties.
              </p>
              <Button
                variant="link"
                className="text-blue-700 h-auto p-0 font-medium text-sm"
              >
                Learn more about privacy
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationSharingSettingsType;
