import {
  getFriends,
  getPendingFriendRequests,
} from "@/modules/friends/server/queries";
import { getGroups } from "@/modules/groups/server/queries";
import ClientFriendsPage from "./client-friends";

const FriendsPage = async () => {
  const friends = await getFriends();
  const groups = await getGroups();
  const pendingRequests = await getPendingFriendRequests();

  return (
    <ClientFriendsPage
      initialFriends={friends}
      initialGroups={groups}
      initialPendingRequests={pendingRequests}
    />
  );
};

export default FriendsPage;
