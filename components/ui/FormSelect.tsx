"use client";

import { Select, SelectItem } from "@heroui/react";
import { ComponentProps } from "react";

type SelectProps = ComponentProps<typeof Select>;

interface FormSelectProps extends Omit<SelectProps, 'selectedKeys' | 'onSelectionChange' | 'label'> {
  id?: string;
  label?: string;
  isRequired?: boolean;
  selectedKey?: string;
  onSelectionChange?: (key: string) => void;
}

export function FormSelect({
  id,
  className,
  children,
  label,
  isRequired,
  placeholder,
  selectedKey,
  onSelectionChange,
  errorMessage,
  isInvalid,
  ...props
}: FormSelectProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-[#374151]">
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <Select
        id={id}
        className={className}
        placeholder={placeholder}
        selectedKeys={selectedKey ? new Set([selectedKey]) : undefined}
        onSelectionChange={(keys) => {
          const key = Array.from(keys)[0] as string;
          onSelectionChange?.(key);
        }}
        isInvalid={isInvalid}
        errorMessage={errorMessage}
        aria-label={label || placeholder}
        {...props}
      >
        {children}
      </Select>
    </div>
  );
}

// Re-export SelectItem from HeroUI for convenience
export { SelectItem };
