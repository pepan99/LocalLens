import { getEvents } from "@/modules/events/server/queries";
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
  const events = await getEvents();

  return (
    <ClientFriendsPage
      friends={friends}
      groups={groups}
      pendingRequests={pendingRequests}
      events={events}
    />
  );
};

export default FriendsPage;
