"use client";

import LocationSharingSettings from "@/components/settings/location-sharing-settings";
import { Card, CardContent } from "@/components/ui/card";
import { LocationSharingConfig } from "@/modules/locations/types/locations";

type Props = {
  locationSettings: LocationSharingConfig;
};

const ClientSettingsPage = ({ locationSettings }: Props) => {
  return (
    <div className="container">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        <LocationSharingSettings settings={locationSettings} />
      </div>
    </div>
  );
};

export default ClientSettingsPage;
