import { auth } from "@/auth";
import MapReturnButton from "@/components/buttons/map-return-button";
import { EventDetail } from "@/components/events/event-detail/utils";
import NotificationEventList from "@/components/notifications/notification-event-list";
import { User } from "next-auth";

const fetchUserNotifications = async (user: User): Promise<EventDetail[]> => {
  // mock data - would be nice to have till end of week + 1 day
  return [
    {
      id: "1",
      title: "Weekend Farmers Market",
      category: "Food",
      date: new Date().toISOString(),
      location: "Freedom Square, Brno",
      coordinates: [69.6969, -69.6969],
      attendees: 24,
      rating: 4.5,
      isOwner: false,
      description:
        "Discover the freshest local produce, artisanal foods, and handcrafted goods at our weekend farmers market. Support local farmers and businesses while enjoying delicious treats.",
      capacity: 50,
      isPrivate: true,
      imageUrl: "/images/placeholder.jpg",
    },
    {
      id: "2",
      title: "Weekly Running Club",
      category: "Sports",
      date: new Date(
        new Date().setMonth(new Date().getMonth() + 1),
      ).toISOString(),
      location: "Lužánky Park, Brno",
      coordinates: [69.6969, -69.6969],
      attendees: 55,
      rating: 4.9,
      isOwner: true,
      description:
        "Join our friendly running group for a 5K run through the beautiful Lužánky Park. All fitness levels are welcome. We meet by the main entrance and finish with stretches and socializing.",
      capacity: 60,
      isPrivate: false,
      imageUrl: "/images/placeholder.jpg",
    },
  ];
};

const NotificationsPage = async () => {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="mt-2 text-muted-foreground py-2">
            You need to be signed in to view notifications.
          </p>
          <MapReturnButton title="Return to Map" />
        </div>
      </div>
    );
  }

  const eventNotifications: EventDetail[] = await fetchUserNotifications(user);

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Notifications</h1>
        <NotificationEventList events={eventNotifications} />
        <MapReturnButton title="Return to Map" />
      </div>
    </div>
  );
};

export default NotificationsPage;
