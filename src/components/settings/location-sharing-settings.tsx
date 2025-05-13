"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  disableLocationSharing,
  enableLocationSharing,
} from "@/modules/locations/actions/locations";
import { LocationSharingConfig } from "@/modules/locations/types/locations";
import { useState } from "react";
import { toast } from "sonner";

interface LocationSharingSettingsProps {
  settings: LocationSharingConfig;
}

const LocationSharingSettings = ({
  settings: initialSettings,
}: LocationSharingSettingsProps) => {
  const [settings, setSettings] =
    useState<LocationSharingConfig>(initialSettings);

  const handleSettingsChange = async (value: boolean) => {
    setSettings(prev => ({
      ...prev,
      isSharingLocation: value,
    }));

    if (value) {
      const res = await enableLocationSharing();
      if (res.type === "error") {
        setSettings(prev => ({
          ...prev,
          isSharingLocation: false,
        }));
        toast.error("Failed to enable location sharing");
        return;
      }

      toast.success("Location sharing enabled");
    } else {
      const res = await disableLocationSharing();
      if (res.type === "error") {
        setSettings(prev => ({
          ...prev,
          isSharingLocation: true,
        }));
        toast.error("Failed to disable location sharing");
        return;
      }
      toast.success("Location sharing disabled");
    }
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
            checked={settings.isSharingLocation}
            onCheckedChange={value => handleSettingsChange(value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationSharingSettings;
