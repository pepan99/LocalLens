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
import {
  CreateEventFormValues,
  createEventSchema,
} from "@/modules/events/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import BasicInfoStep from "./basic-info-step";
import DateDetailsStep from "./date-details-step";
import FormFooter from "./form-footer";
import LocationStep from "./location-step";

interface CreateEventFormProps {
  onSubmit: (
    values: CreateEventFormValues,
    coordinates: [number, number],
  ) => void;
  onCancel: () => void;
}

const CreateEventForm = ({ onSubmit, onCancel }: CreateEventFormProps) => {
  const [step, setStep] = useState(1);
  const [coordinates, setCoordinates] = useState<[number, number]>([
    49.19514, 16.6083,
  ]);
  const totalSteps = 3;

  // Initialize form with default values
  const form = useForm({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      location: "",
      customLocation: "",
      date: undefined,
      time: "",
      capacity: "",
      isPrivate: false,
      imageUrl: "",
    },
  });

  // Handle form submission
  const handleSubmit = (values: CreateEventFormValues) => {
    onSubmit(values, coordinates);
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
      <CardHeader>
        <CardTitle className="text-2xl">Create New Event</CardTitle>
        <CardDescription>
          Get started by filling out the information below to create your event
        </CardDescription>
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
      <CardFooter className="w-full">
        <FormFooter
          step={step}
          setStep={setStep}
          totalSteps={totalSteps}
          onSubmit={form.handleSubmit(handleSubmit)}
          onCancel={onCancel}
          form={form}
        />
      </CardFooter>
    </Card>
  );
};

export default CreateEventForm;
