"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Button } from "./button";

type ProgressStepsProps = {
  steps: string[];
  currentStep: number;
  completedSteps: Record<number, boolean>;
  onStepClick?: (step: number) => void;
};

export const ProgressSteps = ({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
}: ProgressStepsProps) => {
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between relative">
        {/* Progress bar */}
        <div className="absolute top-4 left-0 h-1 bg-gray-200 w-full -z-10" />
        <div
          className="absolute top-4 left-0 h-1 bg-primary transition-all -z-10"
          style={{
            width: `${(Math.max(0, currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />

        {/* Steps */}
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = completedSteps[stepNumber];
          const isClickable =
            !!onStepClick && (isCompleted || stepNumber < currentStep);

          return (
            <Button
              key={stepNumber}
              className={cn(
                "flex flex-col items-center relative",
                isClickable && "cursor-pointer",
              )}
              onClick={() => isClickable && onStepClick(stepNumber)}
            >
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-sm border-2",
                  isActive
                    ? "border-primary bg-primary text-white"
                    : isCompleted
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-gray-300 bg-white text-gray-500",
                )}
              >
                {isCompleted ? <Check className="h-5 w-5" /> : stepNumber}
              </div>
              <div
                className={cn(
                  "mt-2 text-sm font-medium text-center",
                  isActive
                    ? "text-primary"
                    : isCompleted
                      ? "text-green-600"
                      : "text-gray-500",
                )}
              >
                {label}
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
