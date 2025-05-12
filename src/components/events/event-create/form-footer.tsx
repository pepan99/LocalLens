"use client";

import { Button } from "@/components/ui/button";
import { CreateEventFormValues } from "@/modules/events/schemas/schemas";
import { Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface FormFooterProps {
  step: number;
  setStep: (step: number) => void;
  totalSteps: number;
  onSubmit: () => void;
  onCancel: () => void;
  form: UseFormReturn<CreateEventFormValues>;
  isSubmitting?: boolean;
}

const FormFooter = ({
  step,
  setStep,
  totalSteps,
  onSubmit,
  onCancel,
  form,
  isSubmitting = false,
}: FormFooterProps) => {
  return (
    <div className="flex w-full justify-between">
      {step > 1 ? (
        <Button
          variant="outline"
          onClick={() => setStep(step - 1)}
          disabled={isSubmitting}
        >
          Previous
        </Button>
      ) : (
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      )}

      {step < totalSteps ? (
        <Button onClick={() => setStep(step + 1)} disabled={isSubmitting}>
          Next
        </Button>
      ) : (
        <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Event"
          )}
        </Button>
      )}
    </div>
  );
};

export default FormFooter;
