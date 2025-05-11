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
import { CreateEventFormValues } from "@/modules/events/schemas/schemas";
import dynamic from "next/dynamic";
import { UseFormReturn } from "react-hook-form";
import { AVAILABLE_LOCATIONS, locationCoordinates } from "./utils";

type LocationStepProps = {
  form: UseFormReturn<CreateEventFormValues>;
  coordinates: [number, number];
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

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <Select
              onValueChange={value => {
                field.onChange(value);

                // Set default coordinates based on selected location
                const coords = locationCoordinates[value];
                if (coords) {
                  setCoordinates(coords);
                }
              }}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
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
        <FormLabel>Choose Location on Map</FormLabel>
        <div className="border rounded-md overflow-hidden h-[300px]">
          <LocationPicker
            initialLocation={coordinates || [49.19, 16.61]}
            onLocationSelected={(lat, lng) => setCoordinates([lat, lng])}
            viewOnly={false}
          />
        </div>
        {coordinates ? (
          <p className="text-sm text-gray-500">
            Selected coordinates: {coordinates[0].toFixed(5)},{" "}
            {coordinates[1].toFixed(5)}
          </p>
        ) : (
          <p className="text-sm text-gray-500">
            Click on the map to select a location
          </p>
        )}
      </div>
    </div>
  );
};

export default LocationStep;
