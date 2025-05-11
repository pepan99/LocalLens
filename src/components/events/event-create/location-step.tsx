"use client";

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
import { Check, MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { AVAILABLE_LOCATIONS, locationCoordinates } from "./utils";

type LocationStepProps = {
  form: UseFormReturn<CreateEventFormValues>;
  coordinates: [number, number] | null;
  setCoordinates: (coordinates: [number, number]) => void;
};

const LocationStep = ({
  form,
  coordinates,
  setCoordinates,
}: LocationStepProps) => {
  const LocationPicker = dynamic(
    () => import("@/components/events/location-picker"),
    { ssr: false },
  );

  // Validate fields on mount
  useEffect(() => {
    // Trigger validation for existing values
    if (form.getValues("location")) {
      form.trigger("location");
    }

    // If we have a location but no coordinates, try to set default coordinates
    const location = form.getValues("location");
    if (location && !coordinates && locationCoordinates[location]) {
      setCoordinates(locationCoordinates[location]);
    }
  }, [form, coordinates, setCoordinates]);

  // Check if location field is valid
  const isLocationValid =
    !form.formState.errors.location && form.getValues("location");

  return (
    <div className="space-y-6">
      <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-md mb-4">
        <p>
          Please select the location for your event by choosing from the
          predefined locations or entering a custom one. Then, pinpoint the
          exact location on the map.
        </p>
      </div>

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

                // Set default coordinates based on selected location
                const coords = locationCoordinates[value];
                if (coords) {
                  setCoordinates(coords);
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
                {AVAILABLE_LOCATIONS.map(location => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
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
            <FormControl>
              <Input
                placeholder="Enter a custom location if not in the list above"
                {...field}
                onChange={e => {
                  field.onChange(e.target.value);
                  if (e.target.value) {
                    form.setValue("location", e.target.value);
                    form.trigger("location");
                  }
                }}
              />
            </FormControl>
            <FormDescription>
              If your location isn&apos;t in the list above, you can enter it
              here
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-2">
        <FormLabel className="flex items-center">
          Choose Location on Map
          <span className="text-red-500 ml-1">*</span>
          {coordinates && <Check className="h-4 w-4 ml-2 text-green-500" />}
        </FormLabel>
        <div
          className={cn(
            "border rounded-md overflow-hidden h-[300px]",
            !coordinates ? "border-red-300" : "border-green-300",
          )}
        >
          <LocationPicker
            initialLocation={coordinates || [49.19, 16.61]}
            onLocationSelected={(lat, lng) => setCoordinates([lat, lng])}
            viewOnly={false}
          />
        </div>
        {coordinates ? (
          <div className="flex items-center text-sm text-green-600">
            <MapPin className="h-4 w-4 mr-1" />
            Selected coordinates: {coordinates[0].toFixed(5)},{" "}
            {coordinates[1].toFixed(5)}
          </div>
        ) : (
          <p className="text-sm text-red-500">
            <MapPin className="h-4 w-4 inline mr-1" />
            Click on the map to select a precise location
          </p>
        )}
      </div>

      <div className="text-sm text-muted-foreground mt-6">
        <span className="text-red-500">*</span> Required fields
      </div>
    </div>
  );
};

export default LocationStep;
