"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { ProgressSteps } from "@/components/ui/progress-steps";
import { useMultiStepForm } from "@/hooks/use-multi-step-form";
import { createEvent } from "@/modules/events/actions/events";
import {
  CreateEventFormValues,
  createEventSchema,
} from "@/modules/events/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import BasicInfoStep from "./basic-info-step";
import DateDetailsStep from "./date-details-step";
import FormNavigation from "./form-navigation";
import LocationStep from "./location-step";

const CreateEventForm = () => {
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const totalSteps = 3;
  const stepLabels = ["Basic Info", "Location", "Date & Details"];
  const [isValidating, setIsValidating] = useState(false);

  const form = useForm<CreateEventFormValues>({
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
    mode: "onBlur",
  });

  const stepValidationConfig = {
    fields: {
      1: ["title", "description", "category"],
      2: ["location"],
      3: ["date", "time", "capacity"],
    },
    customValidators: {
      2: (_data: CreateEventFormValues) => {
        if (!coordinates) {
          return false;
        }
        return true;
      },
    },
  };

  const {
    currentStep,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    validateStep,
    isStepCompleted,
  } = useMultiStepForm(form, stepValidationConfig, totalSteps);

  const handleNext = async () => {
    setIsValidating(true);

    try {
      await goToNextStep();
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (values: CreateEventFormValues) => {
    setIsValidating(true);

    try {
      const step1Valid = await validateStep(1);
      const step2Valid = await validateStep(2);
      const step3Valid = await validateStep(3);

      if (!step1Valid || !step2Valid || !step3Valid) {
        if (!step1Valid) {
          toast.error("Please complete the Basic Info section");
          goToStep(1);
        } else if (!step2Valid) {
          toast.error("Please complete the Location section");
          goToStep(2);
        } else {
          toast.error("Please complete the Date & Details section");
          goToStep(3);
        }
        return;
      }

      if (!coordinates) {
        toast.error("Please select a location on the map");
        goToStep(2);
        return;
      }

      // Call the createEvent server action and handle the response
      const result = await createEvent(values, coordinates);

      if (result.type === "success") {
        toast.success(result.message || "Event created successfully!");

        // Redirect to map page after successful creation
        setTimeout(() => {
          window.location.href = "/map";
        }, 1500);
      } else {
        // Handle error case
        toast.error(result.message || "Failed to create event");
      }
    } finally {
      setIsValidating(false);
    }
  };

  const handleCancel = () => {
    const formData = form.getValues();
    if (Object.values(formData).some(val => !!val) || coordinates) {
      if (
        confirm(
          "Are you sure you want to cancel? All your progress will be lost.",
        )
      ) {
        window.location.href = "/map";
      }
    } else {
      window.location.href = "/map";
    }
  };

  const hasStepErrors = () => {
    return getStepErrors().length > 0;
  };

  const getStepErrors = () => {
    const errors = form.formState.errors;
    const errorFields = Object.keys(errors);

    if (currentStep === 1) {
      return errorFields
        .filter(field => ["title", "description", "category"].includes(field))
        .map(field => errors[field as keyof typeof errors]?.message);
    } else if (currentStep === 2) {
      const locationErrors = errorFields
        .filter(field => ["location"].includes(field))
        .map(field => errors[field as keyof typeof errors]?.message);

      if (!coordinates && form.getValues("location")) {
        locationErrors.push("Please select a location on the map");
      }

      return locationErrors;
    } else if (currentStep === 3) {
      return errorFields
        .filter(field => ["date", "time", "capacity"].includes(field))
        .map(field => errors[field as keyof typeof errors]?.message);
    }

    return [];
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">Create New Event</CardTitle>
            <CardDescription>
              Get started by filling out the information below to create your
              event. Complete all steps to proceed.
            </CardDescription>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => (window.location.href = "/map")}
            className="lg:hidden"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <ProgressSteps
          steps={stepLabels}
          currentStep={currentStep}
          completedSteps={isStepCompleted}
          onStepClick={goToStep}
        />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {currentStep === 1 && <BasicInfoStep form={form} />}
            {currentStep === 2 && (
              <LocationStep
                form={form}
                coordinates={coordinates}
                setCoordinates={setCoordinates}
              />
            )}
            {currentStep === 3 && <DateDetailsStep form={form} />}

            {getStepErrors().length > 0 && (
              <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md mt-4">
                <p className="font-semibold">
                  Please fix the following errors:
                </p>
                <ul className="list-disc list-inside mt-1">
                  {getStepErrors().map((error, index) => (
                    <li key={index}>{String(error)}</li>
                  ))}
                </ul>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
      <CardFooter className="w-full">
        <FormNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          onPrevious={goToPreviousStep}
          onNext={handleNext}
          onSubmit={form.handleSubmit(handleSubmit)}
          onCancel={handleCancel}
          isValidating={isValidating}
          hasErrors={hasStepErrors()}
        />
      </CardFooter>
    </Card>
  );
};

export default CreateEventForm;
