"use client";

import { Card, CardBody, Chip, Progress } from "@heroui/react";
import { cn } from "@/lib/utils";

interface MetricsCardProps {
  title: string;
  value: number;
  unit?: string;
  threshold?: { min: number; max: number };
  icon?: React.ReactNode;
  description?: string;
  status?: "good" | "warning" | "danger" | "neutral";
}

export function MetricsCard({
  title,
  value,
  unit = "",
  threshold,
  icon,
  description,
  status: providedStatus,
}: MetricsCardProps) {
  // Determinar status baseado no threshold se não foi fornecido
  const determineStatus = (): "good" | "warning" | "danger" | "neutral" => {
    if (providedStatus) return providedStatus;
    
    if (!threshold) return "neutral";

    if (value >= threshold.min && value <= threshold.max) {
      return "good";
    } else if (
      value < threshold.min - (threshold.max - threshold.min) * 0.2 ||
      value > threshold.max + (threshold.max - threshold.min) * 0.2
    ) {
      return "danger";
    } else {
      return "warning";
    }
  };

  const status = determineStatus();

  const getStatusColor = () => {
    switch (status) {
      case "good":
        return "success";
      case "warning":
        return "warning";
      case "danger":
        return "danger";
      default:
        return "default";
    }
  };

  const getGradientClass = () => {
    switch (status) {
      case "good":
        return "gradient-success";
      case "warning":
        return "gradient-warning";
      case "danger":
        return "gradient-danger";
      default:
        return "";
    }
  };

  const getStatusText = () => {
    if (!threshold) return null;

    switch (status) {
      case "good":
        return "Dentro do ideal";
      case "warning":
        return "Atenção";
      case "danger":
        return "Fora do recomendado";
      default:
        return null;
    }
  };

  // Calcular percentual para progress bar se threshold existir
  const getProgressValue = () => {
    if (!threshold) return null;

    const range = threshold.max - threshold.min;
    const normalizedValue = Math.max(
      0,
      Math.min(100, ((value - threshold.min) / range) * 100)
    );
    return normalizedValue;
  };

  const progressValue = getProgressValue();

  return (
    <Card
      className={cn(
        "bg-white border border-[#E5E7EB] rounded-2xl transition-all duration-200 hover:shadow-md",
        getGradientClass()
      )}
    >
      <CardBody className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-[#6B7280] font-medium mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#111827]">
                {value}
              </span>
              {unit && (
                <span className="text-sm text-[#6B7280] font-medium">
                  {unit}
                </span>
              )}
            </div>
          </div>

          {icon && (
            <div className="w-12 h-12 rounded-xl bg-[#F9FAFB] flex items-center justify-center flex-shrink-0">
              {icon}
            </div>
          )}
        </div>

        {/* Status Indicator */}
        {threshold && getStatusText() && (
          <div className="flex items-center gap-2">
            <Chip
              size="sm"
              variant="flat"
              color={getStatusColor()}
              className="font-medium"
            >
              {getStatusText()}
            </Chip>
            {threshold && (
              <span className="text-xs text-[#9CA3AF]">
                Ideal: {threshold.min}-{threshold.max}{unit}
              </span>
            )}
          </div>
        )}

        {/* Progress Bar */}
        {progressValue !== null && (
          <Progress
            value={progressValue}
            maxValue={100}
            color={getStatusColor()}
            size="sm"
            radius="lg"
            classNames={{
              track: "bg-[#F3F4F6]",
            }}
          />
        )}

        {/* Description */}
        {description && (
          <p className="text-xs text-[#6B7280] leading-relaxed">
            {description}
          </p>
        )}
      </CardBody>
    </Card>
  );
}
