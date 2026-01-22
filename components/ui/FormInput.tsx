"use client";

import { Input } from "@heroui/react";
import { ComponentProps } from "react";

type FormInputProps = ComponentProps<typeof Input> & {
  label?: string;
  onValueChange?: (value: string) => void;
};

export function FormInput({
  id,
  label,
  className,
  onValueChange,
  isRequired,
  endContent,
  isInvalid,
  errorMessage,
  ...props
}: FormInputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-[#374151]">
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <Input
        id={id}
        aria-label={label}
        className={className}
        onValueChange={onValueChange}
        isRequired={isRequired}
        endContent={endContent}
        isInvalid={isInvalid}
        errorMessage={errorMessage}
        classNames={{
          inputWrapper: [
            "min-h-[48px]",
            "bg-white",
            "border-2",
            "border-[#E5E7EB]",
            "hover:border-[#D1D5DB]",
            "data-[focus=true]:border-[#2E63CD]",
            "data-[focus=true]:bg-[#EBF0FA]",
            "rounded-xl",
            "shadow-none",
            "transition-all",
            "duration-200",
          ],
          input: [
            "text-[#1F2937]",
            "placeholder:text-[#9CA3AF]",
            "!border-0",
            "!outline-none",
            "!shadow-none",
            endContent ? "pr-2" : "",
          ],
          innerWrapper: [
            endContent ? "gap-2" : "",
          ],
        }}
        {...props}
      />
    </div>
  );
}
