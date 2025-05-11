"use client";

import { useState } from "react";
import { Path, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

type StepValidationFields = {
  [key: number]: string[];
};

type StepValidationConfig<T> = {
  fields: StepValidationFields;
  customValidators?: {
    [key: number]: (data: T) => boolean | Promise<boolean>;
  };
};

export const useMultiStepForm = <T extends object>(
  form: UseFormReturn<T>,
  config: StepValidationConfig<T>,
  totalSteps: number,
) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepsCompleted, setStepsCompleted] = useState<Record<number, boolean>>(
    {},
  );

  const validateStep = async (step: number): Promise<boolean> => {
    const fieldsToValidate = config.fields[step] || [];

    let isValid = await form.trigger(fieldsToValidate as unknown as Path<T>);

    if (isValid && config.customValidators && config.customValidators[step]) {
      const customValidatorResult = await config.customValidators[step]!(
        form.getValues(),
      );
      isValid = isValid && customValidatorResult;
    }

    setStepsCompleted(prev => ({
      ...prev,
      [step]: isValid,
    }));

    return isValid;
  };

  const goToNextStep = async () => {
    const isCurrentStepValid = await validateStep(currentStep);

    if (isCurrentStepValid) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      toast.error(`Please complete all required fields in step ${currentStep}`);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = async (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step);
    } else if (step > currentStep) {
      const isCurrentStepValid = await validateStep(currentStep);
      if (isCurrentStepValid) {
        setCurrentStep(step);
      } else {
        toast.error(
          `Please complete all required fields in step ${currentStep}`,
        );
      }
    }
  };

  const isFormCompleted = () => {
    for (let i = 1; i <= totalSteps; i++) {
      if (!stepsCompleted[i]) {
        return false;
      }
    }
    return true;
  };

  return {
    currentStep,
    totalSteps,
    isStepCompleted: stepsCompleted,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    validateStep,
    isFormCompleted,
  };
};
