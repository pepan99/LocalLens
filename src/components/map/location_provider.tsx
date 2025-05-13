import { updateUserLocation } from "@/modules/locations/actions/locations";
import { useSession } from "next-auth/react";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

type LocationContextType = {
  position: [number, number] | null;
  error: string | null;
  loading: boolean;
};

// Create the context with a default value
const LocationContext = createContext<LocationContextType>({
  position: null,
  error: null,
  loading: false,
});

// Custom hook to use the location context
export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};

type LocationProviderProps = {
  children: ReactNode;
};

export const LocationProvider = ({ children }: LocationProviderProps) => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const session = useSession();
  const userId = session?.data?.user?.id;

  /**
   * Update user position
   * Get user position and send it to the server
   */
  const updatePosition = useCallback(() => {
    const options = {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 1,
    };

    if (!navigator || !navigator.geolocation) {
      const errorMsg = "Geolocation is not supported by your browser";
      toast.error(errorMsg);
      setError(errorMsg);
      return;
    }

    console.log("Getting user location");

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos: GeolocationPosition) => {
        const crd = pos.coords;

        setPosition([crd.latitude, crd.longitude] as [number, number]);
        setLoading(false);

        if (userId) {
          await updateUserLocation([crd.latitude, crd.longitude]);
        }
      },
      (err: GeolocationPositionError) => {
        let errorMsg = "Error getting location";

        // Handle specific error cases
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMsg = "Location access was denied by the user";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMsg = "Location information is unavailable";
            break;
          case err.TIMEOUT:
            errorMsg = "The request to get user location timed out";
            break;
        }
        console.warn(errorMsg, err);
        setError(errorMsg);
        setLoading(false);
      },
      options,
    );
  }, [userId]);

  useEffect(() => {
    updatePosition();
    const intervalId = setInterval(updatePosition, 10000);

    return () => clearInterval(intervalId);
  }, [updatePosition]);

  return (
    <LocationContext.Provider
      value={{
        position,
        error,
        loading,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

/**
 * Calculate the distance between two coordinates in kilometers (using haversine formula)
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  // Radius of the Earth in kilometers
  const R = 6371;

  // Convert latitude and longitude from degrees to radians
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  // Haversine formula
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers

  return distance;
};
// Default export
export default LocationProvider;
