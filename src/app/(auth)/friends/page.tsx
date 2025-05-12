import {
  getFriends,
  getPendingFriendRequests,
} from "@/modules/friends/server/queries";
import ClientFriendsPage from "./client-friends";

const FriendsPage = async () => {
  const friends = await getFriends();
  const pendingRequests = await getPendingFriendRequests();

  return (
    <ClientFriendsPage
      initialFriends={friends}
      initialPendingRequests={pendingRequests}
    />
  );
};

export default FriendsPage;
