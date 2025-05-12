"use client";

import { EventType } from "@/modules/events/types/events";
import dynamic from "next/dynamic";
import { MapContainer } from "react-leaflet";

const LazyMap = dynamic(() => import("./map"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

type MapCallerProps = {
  children?: React.ReactNode;
  initialCenter?: [number, number];
  initialZoom?: number;
  showEvents?: boolean;
  showFriends?: boolean;
  trackLocation?: boolean;
  enabledInteraction?: boolean;
  events: EventType[];
} & Omit<
  React.ComponentProps<typeof MapContainer>,
  "center" | "zoom" | "children"
>;

const MapCaller = (props: MapCallerProps) => {
  return <LazyMap {...props} />;
};

export default MapCaller;
