"use client";

import { EventType } from "@/modules/events/types/events";
import dynamic from "next/dynamic";
import { useMemo } from "react";

type MapBackgroundProps = {
  events: EventType[];
};

export const MapBackground = ({ events }: MapBackgroundProps) => {
  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/map/map/map"), {
        loading: () => (
          <div className="w-full h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
              <p className="mt-2 text-gray-600">Loading map...</p>
            </div>
          </div>
        ),
        ssr: false,
      }),
    [],
  );

  return <Map events={events} />;
};
