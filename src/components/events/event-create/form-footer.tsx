"use client";

import { Button } from "@/components/ui/button";
import { CreateEventFormValues } from "@/modules/events/schemas/schemas";
import { UseFormReturn } from "react-hook-form";

interface FormFooterProps {
  step: number;
  setStep: (step: number) => void;
  totalSteps: number;
  onSubmit: () => void;
  onCancel: () => void;
  form: UseFormReturn<CreateEventFormValues>;
}

const FormFooter = ({
  step,
  setStep,
  totalSteps,
  onSubmit,
  onCancel,
  form,
}: FormFooterProps) => {
  return (
    <div className="flex w-full justify-between">
      {step > 1 ? (
        <Button variant="outline" onClick={() => setStep(step - 1)}>
          Previous
        </Button>
      ) : (
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      )}

      {step < totalSteps ? (
        <Button onClick={() => setStep(step + 1)}>Next</Button>
      ) : (
        <Button onClick={form.handleSubmit(onSubmit)}>Create Event</Button>
      )}
    </div>
  );
};

export default FormFooter;
