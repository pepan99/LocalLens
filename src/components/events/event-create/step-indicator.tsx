"use client";

import { Check } from "lucide-react";

type StepIndicatorProps = {
  currentStep: number;
  totalSteps: number;
  completedSteps: Record<number, boolean>;
};

const StepIndicator = ({
  currentStep,
  totalSteps,
  completedSteps,
}: StepIndicatorProps) => {
  const stepLabels = ["Basic Info", "Location", "Date & Details"];

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNumber = i + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = completedSteps[stepNumber];

          return (
            <div
              key={stepNumber}
              className={`flex flex-col items-center relative flex-1 ${i > 0 ? "ml-4" : ""}`}
            >
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${isActive ? "bg-primary text-white" : isCompleted ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}
                  ${isActive ? "ring-4 ring-primary/20" : ""}
                `}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : stepNumber}
              </div>
              <div className="mt-2 text-xs font-medium text-center">
                {stepLabels[i]}
              </div>
              {/* Connector line */}
              {i < totalSteps - 1 && (
                <div
                  className={`absolute top-4 left-[calc(50%+16px)] w-[calc(100%-32px)] h-0.5 
                    ${isCompleted && completedSteps[stepNumber + 1] ? "bg-green-500" : "bg-gray-200"}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
