"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AttendingUser, RSVPStatusEnum } from "@/modules/events/types/events";
import { CalendarCheck, CalendarClock, User } from "lucide-react";

interface RSVPAttendeesProps {
  attendees: AttendingUser[];
  className?: string;
}

const RSVPAttendees = ({ attendees, className = "" }: RSVPAttendeesProps) => {
  // Filter attendees by status
  const goingAttendees = attendees.filter(
    attendee => attendee.rsvp.status === RSVPStatusEnum.GOING,
  );

  const maybeAttendees = attendees.filter(
    attendee => attendee.rsvp.status === RSVPStatusEnum.MAYBE,
  );

  // Calculate total number of people attending
  const totalAttending = attendees
    .filter(attendee => attendee.rsvp.status !== RSVPStatusEnum.NOT_GOING)
    .reduce((total, attendee) => total + 1 + (attendee.rsvp.guests || 0), 0);

  return (
    <Card
      className={`bg-gradient-to-br from-white to-blue-100/95 backdrop-blur-sm ${className}`}
    >
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
                        {attendee.image ? (
                          <AvatarImage
                            src={attendee.image}
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
                    {attendee.rsvp.guests > 0 && (
                      <span className="text-sm text-gray-500">
                        +{attendee.rsvp.guests}{" "}
                        {attendee.rsvp.guests === 1 ? "guest" : "guests"}
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
                      {attendee.image ? (
                        <AvatarImage src={attendee.image} alt={attendee.name} />
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
