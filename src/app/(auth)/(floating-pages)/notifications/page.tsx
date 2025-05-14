import { auth } from "@/auth";
import MapReturnButton from "@/components/buttons/map-return-button";
import NotificationEventList from "@/components/notifications/notification-event-list";
import { EventInvitationNotification } from "@/components/notifications/utils";
import { markInvitationsAsSeen } from "@/modules/invitations/actions/invitations";
import { getUserEventInvitations } from "@/modules/invitations/server/queries";

const fetchUserNotifications = async (
  userid: string,
): Promise<EventInvitationNotification[]> => {
  const notifications = await getUserEventInvitations(userid);
  return notifications;
};

const NotificationsPage = async () => {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return (
      <div className="container">
        <div className="bg-gradient-to-br from-white to-orange-100/95 backdrop-blur-sm rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="mt-2 text-muted-foreground py-2">
            You need to be signed in to view notifications.
          </p>
          <MapReturnButton title="Return to Map" />
        </div>
      </div>
    );
  }

  const eventNotifications = await fetchUserNotifications(user.id);

  await markInvitationsAsSeen(user.id);

  return (
    <div className="container">
      <div className="bg-gradient-to-br from-white to-orange-100/95 backdrop-blur-sm rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Notifications</h1>
        <NotificationEventList events={eventNotifications} />
        <MapReturnButton title="Return to Map" />
      </div>
    </div>
  );
};

export default NotificationsPage;
