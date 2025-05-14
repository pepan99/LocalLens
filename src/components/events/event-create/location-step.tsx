"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LocationSourceTypes } from "@/db/schemas/events";
import { cn } from "@/lib/utils";
import { CreateEventFormValues } from "@/modules/events/schemas/schemas";
import { PlaceType } from "@/modules/places";
import { Check, MapPin, X } from "lucide-react";
import dynamic from "next/dynamic";
import { memo, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";

// Memoized Map component to prevent frequent rerenders
const LocationMapPicker = memo(
  ({
    form,
    isCoordinatesValid,
    getFormattedCoordinates,
  }: {
    form: UseFormReturn<CreateEventFormValues>;
    isCoordinatesValid: boolean;
    getFormattedCoordinates: () => string | null;
  }) => {
    // Only import the map component on the client-side
    const LocationPicker = dynamic(
      () => import("@/components/events/location-picker"),
      { ssr: false },
    );

    const handleLocationSelected = useCallback(
      (lat: number, lng: number) => {
        console.log("Location selected on map:", lat, lng);
        // Force values to be numbers to avoid type issues
        const latitude = Number(lat);
        const longitude = Number(lng);

        // Update the form values with validation
        form.setValue("latitude", latitude, {
          shouldTouch: true,
          shouldValidate: true,
          shouldDirty: true,
        });
        form.setValue("longitude", longitude, {
          shouldTouch: true,
          shouldValidate: true,
          shouldDirty: true,
        });

        // Make sure the values are actually set by logging them
        setTimeout(() => {
          console.log("Form values after update:", {
            latitude: form.getValues("latitude"),
            longitude: form.getValues("longitude"),
          });
        }, 100);
      },
      [form],
    );

    return (
      <div className="space-y-2">
        <FormLabel className="flex items-center">
          Choose Location on Map
          {isCoordinatesValid && (
            <Check className="h-4 w-4 ml-2 text-green-500" />
          )}
        </FormLabel>
        <div
          className={cn(
            "border rounded-md overflow-hidden h-[300px]",
            !isCoordinatesValid ? "border-red-300" : "border-green-300",
          )}
        >
          <LocationPicker
            initialLocation={
              form.getValues("latitude") && form.getValues("longitude")
                ? [
                    form.getValues("latitude") as number,
                    form.getValues("longitude") as number,
                  ]
                : [49.19, 16.61]
            }
            onLocationSelected={handleLocationSelected}
            viewOnly={false}
          />
        </div>
        {isCoordinatesValid ? (
          <div className="flex items-center text-sm text-green-600">
            <MapPin className="h-4 w-4 mr-1" />
            Selected coordinates: {getFormattedCoordinates()}
          </div>
        ) : (
          <p className="text-sm text-red-500">
            <MapPin className="h-4 w-4 inline mr-1" />
            Click on the map to select a precise location
          </p>
        )}
      </div>
    );
  },
);

LocationMapPicker.displayName = "LocationMapPicker";

type LocationStepProps = {
  form: UseFormReturn<CreateEventFormValues>;
  places: PlaceType[];
};

const LocationStep = ({ form, places }: LocationStepProps) => {
  // Check if location field is valid and coordinates are set
  const isLocationValid =
    !form.formState.errors.location && form.getValues("location");

  const isCoordinatesValid =
    form.getValues("latitude") && form.getValues("longitude");

  // Display formatted coordinate values
  const getFormattedCoordinates = useCallback(() => {
    const lat = form.getValues("latitude");
    const lng = form.getValues("longitude");
    if (lat && lng) {
      return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    }
    return null;
  }, [form]);

  // Helper to handle clearing custom location
  const handleClearLocation = useCallback(() => {
    // Clear the customLocation field
    form.setValue("customLocation", "");

    // If there's a selected place from the dropdown, switch back to it
    if (form.getValues("selectedPlace")) {
      const selectedPlace = places.find(
        place => place.name === form.getValues("selectedPlace"),
      );

      if (selectedPlace) {
        // Switch back to place mode
        form.setValue("locationSource", LocationSourceTypes.PLACE);
        form.setValue("placeId", selectedPlace.id);
        form.setValue("location", form.getValues("selectedPlace"), {
          shouldTouch: true,
          shouldValidate: true,
        });
      } else {
        // Otherwise, clear the location field but stay in custom mode
        form.setValue("locationSource", LocationSourceTypes.CUSTOM);
        form.setValue("placeId", undefined);
        form.setValue("location", "", {
          shouldTouch: true,
          shouldValidate: true,
        });
      }
    } else {
      // No selected place, stay in custom mode but clear fields
      form.setValue("locationSource", LocationSourceTypes.CUSTOM);
      form.setValue("placeId", undefined);
      form.setValue("location", "", {
        shouldTouch: true,
        shouldValidate: true,
      });
    }
  }, [form, places]);

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Location
              <span className="text-red-500 ml-1">*</span>
              {isLocationValid && (
                <Check className="h-4 w-4 ml-2 text-green-500" />
              )}
            </FormLabel>
            <Select
              onValueChange={value => {
                field.onChange(value);
                form.trigger("location");
                // Save the selected place name for reference
                form.setValue("selectedPlace", value);
                // Clear any custom location when selecting from dropdown
                form.setValue("customLocation", "");

                const selectedPlace = places.find(
                  place => place.name === value,
                );

                if (selectedPlace) {
                  console.log("Selected place:", selectedPlace);

                  // Set the locationSource to "place" and store the placeId
                  form.setValue("locationSource", LocationSourceTypes.PLACE);
                  form.setValue("placeId", selectedPlace.id);

                  // Check if the place has latitude and longitude
                  if (selectedPlace.latitude && selectedPlace.longitude) {
                    // Convert string coordinates to numbers
                    const lat = Number(selectedPlace.latitude);
                    const lng = Number(selectedPlace.longitude);

                    console.log(
                      "Setting coordinates from place selection:",
                      lat,
                      lng,
                    );

                    // Set coordinates directly without relying on the field's onChange handler
                    form.setValue("latitude", lat, {
                      shouldTouch: true,
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                    form.setValue("longitude", lng, {
                      shouldTouch: true,
                      shouldValidate: true,
                      shouldDirty: true,
                    });

                    // Update form validation state
                    form.trigger("locationSource");
                    form.trigger("placeId");
                  } else {
                    console.warn(
                      "Selected place does not have coordinates",
                      selectedPlace,
                    );
                  }
                } else {
                  console.warn("Place not found for name:", value);
                }
              }}
              defaultValue={field.value}
              value={field.value || ""}
            >
              <FormControl>
                <SelectTrigger
                  className={cn(
                    !field.value ? "text-muted-foreground" : "",
                    form.formState.errors.location ? "border-red-300" : "",
                    isLocationValid ? "border-green-300" : "",
                  )}
                >
                  <SelectValue placeholder="Select a location" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {places.length > 0 ? (
                  places.map(place => (
                    <SelectItem key={place.id} value={place.name}>
                      {place.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No places found
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <FormDescription>
              Choose from common locations or specify a custom one below
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="customLocation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Custom Location (optional)</FormLabel>
            <div className="flex gap-2">
              <FormControl>
                <Input
                  placeholder="Enter a custom location if not in the list above"
                  {...field}
                  onChange={e => {
                    // Update customLocation field
                    field.onChange(e.target.value);

                    const customValue = e.target.value;
                    // Update the main location field with the custom value
                    if (customValue) {
                      // When using custom location, set the locationSource to "custom" and clear placeId
                      form.setValue(
                        "locationSource",
                        LocationSourceTypes.CUSTOM,
                      );
                      form.setValue("placeId", undefined);
                      form.setValue("location", customValue, {
                        shouldTouch: true,
                        shouldValidate: true,
                      });
                    } else if (form.getValues("selectedPlace")) {
                      // If custom is empty and there's a selected place, restore it
                      const selectedPlace = places.find(
                        place => place.name === form.getValues("selectedPlace"),
                      );

                      if (selectedPlace) {
                        form.setValue(
                          "locationSource",
                          LocationSourceTypes.PLACE,
                        );
                        form.setValue("placeId", selectedPlace.id);
                        form.setValue(
                          "location",
                          form.getValues("selectedPlace"),
                          {
                            shouldTouch: true,
                            shouldValidate: true,
                          },
                        );
                      } else {
                        // Otherwise, clear the location field
                        form.setValue(
                          "locationSource",
                          LocationSourceTypes.CUSTOM,
                        );
                        form.setValue("placeId", undefined);
                        form.setValue("location", "", {
                          shouldTouch: true,
                          shouldValidate: true,
                        });
                      }
                    } else {
                      // Otherwise, clear the location field
                      form.setValue(
                        "locationSource",
                        LocationSourceTypes.CUSTOM,
                      );
                      form.setValue("placeId", undefined);
                      form.setValue("location", "", {
                        shouldTouch: true,
                        shouldValidate: true,
                      });
                    }
                  }}
                />
              </FormControl>
              {field.value && (
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  onClick={handleClearLocation}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <FormDescription>
              If your location isn&apos;t in the list above, you can enter it
              here
            </FormDescription>
          </FormItem>
        )}
      />

      {/* Use the memoized map component */}
      <LocationMapPicker
        form={form}
        isCoordinatesValid={Boolean(isCoordinatesValid)}
        getFormattedCoordinates={getFormattedCoordinates}
      />
    </div>
  );
};

export default LocationStep;
