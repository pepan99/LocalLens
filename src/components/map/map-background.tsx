"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

export const MapBackground = () => {
  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/map/map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    [],
  );

  return (
    <Map>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <h1 className="text-4xl font-bold text-center text-white">LocalLens</h1>
        <p className="mt-2 text-lg text-gray-300">Don&apos;t miss any event</p>
      </div>
    </Map>
  );
};
