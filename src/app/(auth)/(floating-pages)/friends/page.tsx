import {
  getFriends,
  getPendingFriendRequests,
} from "@/modules/friends/server/queries";
import { getLocationSharingConfig } from "@/modules/locations/server/queries";
import ClientFriendsPage from "./client-friends";

const FriendsPage = async () => {
  const friends = await getFriends();
  const pendingRequests = await getPendingFriendRequests();
  const locationConfig = await getLocationSharingConfig();

  return (
    <ClientFriendsPage
      initialFriends={friends}
      initialPendingRequests={pendingRequests}
      locationSettings={locationConfig}
    />
  );
};

export default FriendsPage;
