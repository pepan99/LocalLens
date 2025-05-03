"use client";

import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import "leaflet/dist/leaflet.css"; // Must imported to make the leaflet work correctly
import "leaflet/dist/leaflet.js"; // Must imported to make the leaflet work correctly

type MapProps = {} & React.ComponentProps<typeof MapContainer>;

const Map = (props: MapProps) => {
  const { children, ...otherProps } = props;

  //   const { usersPositions, myPosition, trackPosition } = useTrackPositionContext();

  return (
    <MapContainer
      zoomControl={false}
      center={[49.21, 16.599]}
      zoom={12}
      style={{ height: "100vh", width: "100vw" }}
      className="z-0"
      {...otherProps}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* {Object.entries(usersPositions).map(([userId, user]) => {
        if (!user.position || userId === userContext.user?.id) {
          return null;
        }
        return <MapUserMarker key={userId} userId={userId} user={user} />;
      })} */}
      {children}
      {/* {trackPosition && myPosition && (
        <CurrentLocationMarker latitude={myPosition.latitude} longitude={myPosition.longitude} />
      )} */}
    </MapContainer>
  );
};

export default Map;
