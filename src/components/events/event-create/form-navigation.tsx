"use client";

import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Save,
} from "lucide-react";

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onCancel: () => void;
  isValidating?: boolean;
  hasErrors?: boolean;
  isEdit?: boolean;
}

const FormNavigation = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  onCancel,
  isValidating = false,
  hasErrors = false,
  isEdit = false,
}: FormNavigationProps) => {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  const handleSubmit = () => {
    onSubmit();
  };

  return (
    <div className="flex w-full justify-between items-center">
      {isFirstStep ? (
        <Button
          variant="outline"
          onClick={onCancel}
          type="button"
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Cancel
        </Button>
      ) : (
        <Button
          variant="outline"
          onClick={onPrevious}
          type="button"
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
      )}

      {hasErrors && (
        <div className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Please fix the errors</span>
        </div>
      )}

      {isValidating && (
        <div className="text-sm text-amber-500 flex items-center gap-1">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="hidden sm:inline">Validating...</span>
        </div>
      )}

      {isLastStep ? (
        <Button
          onClick={handleSubmit}
          disabled={isValidating}
          className="gap-1"
        >
          <>
            <Save className="h-4 w-4" />
            {isEdit ? "Update Event" : "Create Event"}
          </>
        </Button>
      ) : (
        <Button
          onClick={onNext}
          type="button"
          disabled={isValidating}
          className="gap-1"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default FormNavigation;
