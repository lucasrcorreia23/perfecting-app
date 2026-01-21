"use client";

import { Input, type InputProps } from "@heroui/react";

interface FormInputProps extends InputProps {
  label: string;
}

export function FormInput({ label, className, ...props }: FormInputProps) {
  return (
    <Input
      label={label}
      variant="bordered"
      className={className}
      {...props}
    />
  );
}
