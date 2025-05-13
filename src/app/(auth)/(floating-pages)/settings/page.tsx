import { getLocationSharingConfig } from "@/modules/locations/server/queries";
import ClientSettingsPage from "./client-settings";

const FriendsPage = async () => {
  const locationConfig = await getLocationSharingConfig();
  return <ClientSettingsPage locationSettings={locationConfig} />;
};

export default FriendsPage;
