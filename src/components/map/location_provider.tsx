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

        if (userId !== null) {
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
        if (err.code === err.TIMEOUT) {
          setTimeout(() => {
            updatePosition();
          }, 10);
        }
      },
      options,
    );
  }, []);

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

// Default export
export default LocationProvider;
