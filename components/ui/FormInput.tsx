// @ts-nocheck
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
  startContent,
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
        startContent={startContent}
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
            "data-[focus=true]:border-[#C5D4ED]",
            "data-[focus=true]:shadow-[0_0_0_3px_rgba(46,99,205,0.08)]",
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
            startContent ? "pl-2" : "",
            endContent ? "pr-2" : "",
          ],
          innerWrapper: [
            startContent || endContent ? "gap-2" : "",
          ],
        }}
        {...props}
      />
    </div>
  );
}
