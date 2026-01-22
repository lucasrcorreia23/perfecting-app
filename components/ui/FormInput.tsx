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
        {...props}
      />
    </div>
  );
}
