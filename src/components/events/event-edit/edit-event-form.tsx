"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import BasicInfoStep from "./basic-info-step";
import DateDetailsStep from "./date-details-step";
import FormFooter from "./form-footer";
import LocationStep from "./location-step";
import { EditEventFormValues, editEventSchema, EventWithOwner } from "./utils";

type EditEventFormProps = {
  event: EventWithOwner;
  onSubmit: (
    values: EditEventFormValues,
    coordinates: [number, number] | null,
  ) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
};

const EditEventForm = ({
  event,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: EditEventFormProps) => {
  const [step, setStep] = useState(1);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(
    event.coordinates,
  );
  const totalSteps = 3;

  // Parse the date and time from the event data
  const eventDate = new Date(event.date);
  const hours = eventDate.getHours().toString().padStart(2, "0");
  const minutes = eventDate.getMinutes().toString().padStart(2, "0");
  const timeString = `${hours}:${minutes}`;

  const form = useForm({
    resolver: zodResolver(editEventSchema),
    defaultValues: {
      title: event.title,
      description: event.description,
      category: event.category,
      location: event.location,
      customLocation: "",
      date: eventDate,
      time: timeString,
      capacity: event.capacity,
      isEventPrivate: event.isPrivate,
      imageUrl: "",
    },
  });

  const handleSubmit = (values: EditEventFormValues) => {
    onSubmit(values, coordinates);
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
      <CardHeader>
        <CardTitle className="text-2xl">Edit Event</CardTitle>
        <CardDescription>Update your event details below</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {step === 1 && <BasicInfoStep form={form} />}
            {step === 2 && (
              <LocationStep
                form={form}
                coordinates={coordinates}
                setCoordinates={setCoordinates}
              />
            )}
            {step === 3 && <DateDetailsStep form={form} />}
          </form>
        </Form>
      </CardContent>
      <CardFooter className=" w-full">
        <FormFooter
          step={step}
          setStep={setStep}
          totalSteps={totalSteps}
          onSubmit={form.handleSubmit(handleSubmit)}
          onCancel={onCancel}
          form={form}
          isSubmitting={isSubmitting}
        />
      </CardFooter>
    </Card>
  );
};

export default EditEventForm;
