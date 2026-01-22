"use client";

import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

export function StepIndicator({
  currentStep,
  totalSteps,
  stepLabels,
}: StepIndicatorProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="w-full">
      {/* Progress bars */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {steps.map((step) => (
          <div
            key={step}
            className={cn(
              "h-1 rounded-full transition-all duration-300",
              step < currentStep
                ? "w-12 bg-[#2E63CD]" // Completado
                : step === currentStep
                ? "w-16 bg-gradient-to-r from-[#2E63CD] to-[#4A7FE8]" // Atual (com gradiente)
                : "w-10 bg-[#E5E7EB]" // Futuro
            )}
          />
        ))}
      </div>

      {/* Step labels (opcional) */}
      {stepLabels && (
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {stepLabels.map((label, index) => {
            const step = index + 1;
            return (
              <div
                key={step}
                className={cn(
                  "text-xs font-medium transition-colors duration-200",
                  step < currentStep
                    ? "text-[#2E63CD]" // Completado
                    : step === currentStep
                    ? "text-[#111827]" // Atual
                    : "text-[#9CA3AF]" // Futuro
                )}
              >
                <div className="text-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center mb-1 mx-auto transition-all duration-300",
                      step < currentStep
                        ? "bg-[#2E63CD] text-white" // Completado
                        : step === currentStep
                        ? "bg-gradient-to-br from-[#2E63CD] to-[#4A7FE8] text-white shadow-md" // Atual (com gradiente)
                        : "bg-[#E5E7EB] text-[#6B7280]" // Futuro
                    )}
                  >
                    {step}
                  </div>
                  <span className="hidden sm:block">{label}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
