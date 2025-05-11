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
import {
  CreateEventFormValues,
  createEventSchema,
} from "@/modules/events/schemas/schemas";
import { ProgressSteps } from "@/components/ui/progress-steps";
import { useFormPersistence } from "@/hooks/use-form-persistence";
import { useMultiStepForm } from "@/hooks/use-multi-step-form";
import {
  getStorageItem,
  removeStorageItem,
  setStorageItem,
} from "@/lib/storage-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, Clock, Undo } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import BasicInfoStep from "./basic-info-step";
import DateDetailsStep from "./date-details-step";
import FormNavigation from "./form-navigation";
import LocationStep from "./location-step";

const EVENT_FORM_STORAGE_KEY = "locallens_event_form";
const EVENT_FORM_BACKUP_KEY = "locallens_event_form_backup";

const CreateEventForm = () => {
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const totalSteps = 3;
  const stepLabels = ["Basic Info", "Location", "Date & Details"];
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasBackup, setHasBackup] = useState(false);
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

  const { clearPersistedData, saveCurrentState } = useFormPersistence(
    form,
    coordinates,
    {
      storageKey: EVENT_FORM_STORAGE_KEY,
      persistCoordinates: true,
    },
  );

  useEffect(() => {
    try {
      const savedData = getStorageItem(EVENT_FORM_STORAGE_KEY);
      if (savedData) {
        const { savedCoordinates, lastUpdated } = JSON.parse(savedData);
        if (savedCoordinates) {
          setCoordinates(savedCoordinates);
        }
        if (lastUpdated) {
          setLastSaved(new Date(lastUpdated));
        }
      }

      const backupData = getStorageItem(EVENT_FORM_BACKUP_KEY);
      setHasBackup(!!backupData);
    } catch (error) {
      console.error("Error loading coordinates from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    const backupInterval = setInterval(
      () => {
        const currentData = getStorageItem(EVENT_FORM_STORAGE_KEY);
        if (currentData) {
          setStorageItem(EVENT_FORM_BACKUP_KEY, currentData);
        }
      },
      5 * 60 * 1000,
    );

    return () => clearInterval(backupInterval);
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const formData = form.getValues();

      if (Object.values(formData).some(val => !!val) || coordinates) {
        e.preventDefault();

        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";

        saveCurrentState();

        const currentData = getStorageItem(EVENT_FORM_STORAGE_KEY);
        if (currentData) {
          setStorageItem(EVENT_FORM_BACKUP_KEY, currentData);
        }
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [form, coordinates, saveCurrentState]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      saveCurrentState();
      setLastSaved(new Date());
    }, 60000);

    return () => clearInterval(intervalId);
  }, [saveCurrentState]);

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

      console.log("Creating event:", { ...values, coordinates });

      toast.success("Event created successfully!");

      clearPersistedData();

      removeStorageItem(EVENT_FORM_BACKUP_KEY);

      setTimeout(() => {
        window.location.href = "/map";
      }, 1500);
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
        const currentData = getStorageItem(EVENT_FORM_STORAGE_KEY);
        if (currentData) {
          setStorageItem(EVENT_FORM_BACKUP_KEY, currentData);
        }

        clearPersistedData();
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

  const [hasSavedData, setHasSavedData] = useState(false);

  useEffect(() => {
    const savedData = getStorageItem(EVENT_FORM_STORAGE_KEY);
    if (savedData) {
      try {
        const { lastUpdated } = JSON.parse(savedData);
        if (lastUpdated) {
          setHasSavedData(true);
          setLastSaved(new Date(lastUpdated));
        }
      } catch (e) {
        console.error("Error parsing saved form data", e);
      }
    }
  }, []);

  const handleStartFresh = () => {
    if (
      confirm(
        "Are you sure you want to start with a new form? All your previous data will be lost.",
      )
    ) {
      const currentData = getStorageItem(EVENT_FORM_STORAGE_KEY);
      if (currentData) {
        setStorageItem(EVENT_FORM_BACKUP_KEY, currentData);
      }

      clearPersistedData();
      form.reset();
      setCoordinates(null);
      setHasSavedData(false);
      setLastSaved(null);
      goToStep(1);

      toast.success("Started with a fresh form");
    }
  };

  const handleRestoreBackup = () => {
    try {
      const backupData = getStorageItem(EVENT_FORM_BACKUP_KEY);
      if (backupData) {
        const currentData = getStorageItem(EVENT_FORM_STORAGE_KEY);
        if (currentData) {
          setStorageItem(EVENT_FORM_STORAGE_KEY + "_temp", currentData);
        }

        setStorageItem(EVENT_FORM_STORAGE_KEY, backupData);

        window.location.reload();

        toast.success("Form restored from backup");
      } else {
        toast.error("No backup found to restore");
      }
    } catch (error) {
      console.error("Error restoring from backup", error);
      toast.error("Failed to restore from backup");
    }
  };

  const formatLastSaved = () => {
    if (!lastSaved) return null;

    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - lastSaved.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) {
      return "Just now";
    } else if (diffInMinutes === 1) {
      return "1 minute ago";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else {
      const hours = Math.floor(diffInMinutes / 60);
      if (hours === 1) {
        return "1 hour ago";
      } else {
        return `${hours} hours ago`;
      }
    }
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

        {hasSavedData && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md flex justify-between items-center">
            <div className="text-sm text-blue-600">
              <p className="font-medium">You have a draft event in progress</p>
              <p>Your form data is automatically saved as you type</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleStartFresh}
              className="text-blue-600 border-blue-300 hover:bg-blue-100"
            >
              Start Fresh
            </Button>
          </div>
        )}

        {hasBackup && !hasSavedData && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <div className="text-sm text-amber-600 flex justify-between items-center">
              <div>
                <p className="font-medium">
                  You have a previous form draft available
                </p>
                <p>Would you like to restore your previous work?</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRestoreBackup}
                className="flex items-center gap-1 text-amber-600 border-amber-300 hover:bg-amber-100"
              >
                <Undo className="h-3 w-3" />
                Restore
              </Button>
            </div>
          </div>
        )}
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

            <div className="text-xs text-gray-500 flex items-center justify-end gap-1">
              <Clock className="h-3 w-3" />
              {lastSaved ? (
                <span>Last saved: {formatLastSaved()}</span>
              ) : (
                <span>Auto-saving as you type</span>
              )}
            </div>
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
