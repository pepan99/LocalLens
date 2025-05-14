"use client";

import { PlacesList } from "@/components/places/places-list";
import { EventType } from "@/modules/events/types/events";
import { PlaceType } from "@/modules/places/types/places";

type PlacesWithEvents = { place: PlaceType; events: EventType[] }[];

type ClientPlacesProps = {
  placesWithEvents: PlacesWithEvents;
};

const ClientPlaces = ({ placesWithEvents }: ClientPlacesProps) => {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-6" />

      <PlacesList placesWithEvents={placesWithEvents} />
    </>
  );
};

export default ClientPlaces;
