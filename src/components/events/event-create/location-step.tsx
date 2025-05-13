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
import { cn } from "@/lib/utils";
import { CreateEventFormValues } from "@/modules/events/schemas/schemas";
import { PlaceType } from "@/modules/places";
import { Check, MapPin, X } from "lucide-react";
import dynamic from "next/dynamic";
import { UseFormReturn } from "react-hook-form";

type LocationStepProps = {
  form: UseFormReturn<CreateEventFormValues>;
  places: PlaceType[];
};

const LocationStep = ({ form, places }: LocationStepProps) => {
  const LocationPicker = dynamic(
    () => import("@/components/events/location-picker"),
    { ssr: false },
  );

  // Check if location field is valid and coordinates are set
  const isLocationValid =
    !form.formState.errors.location && form.getValues("location");

  const isCoordinatesValid =
    form.getValues("latitude") && form.getValues("longitude");

  // Display formatted coordinate values
  const getFormattedCoordinates = () => {
    const lat = form.getValues("latitude");
    const lng = form.getValues("longitude");
    if (lat && lng) {
      return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    }
    return null;
  };

  // Helper to handle clearing custom location
  const handleClearLocation = () => {
    form.setValue("location", "");
    form.trigger("location");
  };

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

                const selectedPlace = places.find(
                  place => place.name === value,
                );

                if (selectedPlace) {
                  console.log("Selected place:", selectedPlace);

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

                    // Verify values were set
                    setTimeout(() => {
                      console.log(
                        "Form latitude/longitude after place selection:",
                        {
                          latitude: form.getValues("latitude"),
                          longitude: form.getValues("longitude"),
                        },
                      );
                    }, 100);
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

      <div className="mt-4">
        <FormLabel>Custom Location (optional)</FormLabel>
        <div className="flex gap-2">
          <Input
            placeholder="Enter a custom location if not in the list above"
            value={form.getValues("location") || ""}
            onChange={e => {
              form.setValue("location", e.target.value, {
                shouldTouch: true,
                shouldValidate: true,
              });
            }}
          />
          {form.getValues("location") && (
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
          If your location isn&apos;t in the list above, you can enter it here
        </FormDescription>
      </div>

      <div className="space-y-2">
        <FormLabel className="flex items-center">
          Choose Location on Map
          <span className="text-red-500 ml-1">*</span>
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
            onLocationSelected={(lat, lng) => {
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
            }}
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
    </div>
  );
};

export default LocationStep;
