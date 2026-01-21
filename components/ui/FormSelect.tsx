"use client";

import { Select, SelectItem, type SelectProps } from "@heroui/react";

type FormSelectProps = SelectProps;

export function FormSelect({ className, ...props }: FormSelectProps) {
  return (
    <Select
      variant="bordered"
      className={className}
      {...props}
    />
  );
}

export { SelectItem };
