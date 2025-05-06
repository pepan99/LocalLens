"use client";

import dynamic from "next/dynamic";

const LazyPersistentMap = dynamic(
  () => import("@/components/map/persistent-map"),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  },
);

type MapCallerProps = {
  children?: React.ReactNode;
};

const PersistentMapCaller = (props: MapCallerProps) => {
  return <LazyPersistentMap {...props} />;
};

export default PersistentMapCaller;
