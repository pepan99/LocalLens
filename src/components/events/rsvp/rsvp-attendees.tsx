"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarCheck, CalendarClock, User } from "lucide-react";
import { RSVPStatusEnum } from "./utils";

// Mock attendees data - in a real app, this would come from your API
const MOCK_ATTENDEES = [
  {
    id: "user1",
    name: "Alice Johnson",
    status: RSVPStatusEnum.GOING,
    avatar: "",
    guests: 2,
  },
  {
    id: "user2",
    name: "Bob Smith",
    status: RSVPStatusEnum.GOING,
    avatar: "",
    guests: 0,
  },
  {
    id: "user3",
    name: "Charlie Brown",
    status: RSVPStatusEnum.GOING,
    avatar: "",
    guests: 1,
  },
  {
    id: "user4",
    name: "Diana Prince",
    status: RSVPStatusEnum.MAYBE,
    avatar: "",
    guests: 0,
  },
  {
    id: "user5",
    name: "Ethan Hunt",
    status: RSVPStatusEnum.MAYBE,
    avatar: "",
    guests: 0,
  },
];

interface RSVPAttendeesProps {
  eventId: string;
  className?: string;
}

const RSVPAttendees = ({ eventId, className = "" }: RSVPAttendeesProps) => {
  // Filter attendees by status
  const goingAttendees = MOCK_ATTENDEES.filter(
    attendee => attendee.status === RSVPStatusEnum.GOING,
  );

  const maybeAttendees = MOCK_ATTENDEES.filter(
    attendee => attendee.status === RSVPStatusEnum.MAYBE,
  );

  // Calculate total number of people attending
  const totalAttending = goingAttendees.reduce(
    (total, attendee) => total + 1 + (attendee.guests || 0),
    0,
  );

  return (
    <Card className={`bg-white/90 backdrop-blur-sm ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <User className="mr-2 h-5 w-5" />
          Attendees ({totalAttending})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="going" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="going" className="flex-1">
              <CalendarCheck className="mr-2 h-4 w-4" />
              Going ({goingAttendees.length})
            </TabsTrigger>
            <TabsTrigger value="maybe" className="flex-1">
              <CalendarClock className="mr-2 h-4 w-4" />
              Maybe ({maybeAttendees.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="going" className="space-y-4">
            {goingAttendees.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                No confirmed attendees yet
              </p>
            ) : (
              <div className="space-y-3">
                {goingAttendees.map(attendee => (
                  <div
                    key={attendee.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        {attendee.avatar ? (
                          <AvatarImage
                            src={attendee.avatar}
                            alt={attendee.name}
                          />
                        ) : (
                          <AvatarFallback>
                            {attendee.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <span>{attendee.name}</span>
                    </div>
                    {attendee.guests > 0 && (
                      <span className="text-sm text-gray-500">
                        +{attendee.guests}{" "}
                        {attendee.guests === 1 ? "guest" : "guests"}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="maybe" className="space-y-4">
            {maybeAttendees.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                No tentative attendees
              </p>
            ) : (
              <div className="space-y-3">
                {maybeAttendees.map(attendee => (
                  <div key={attendee.id} className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      {attendee.avatar ? (
                        <AvatarImage
                          src={attendee.avatar}
                          alt={attendee.name}
                        />
                      ) : (
                        <AvatarFallback>
                          {attendee.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span>{attendee.name}</span>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RSVPAttendees;
