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
        classNames={{
          trigger: [
            "min-h-[48px]",
            "bg-white",
            "border-2",
            "border-[#E5E7EB]",
            "hover:border-[#D1D5DB]",
            "data-[focus=true]:border-[#2E63CD]",
            "data-[focus=true]:bg-[#EBF0FA]",
            "data-[open=true]:border-[#2E63CD]",
            "data-[open=true]:bg-[#EBF0FA]",
            "rounded-xl",
            "shadow-none",
            "transition-all",
            "duration-200",
          ],
          value: "text-[#1F2937]",
          popoverContent: "rounded-xl border border-[#E5E7EB] shadow-none overflow-hidden p-1",
          listbox: "p-0 rounded-xl",
          base: "rounded-xl",
          ...props.classNames,
        }}
        popoverProps={{
          classNames: {
            content: "p-1 border border-[#E5E7EB] rounded-xl overflow-hidden shadow-none",
            base: "rounded-xl border border-[#E5E7EB] shadow-none",
          },
        }}
        {...props}
      >
        {children}
      </Select>
    </div>
  );
}

// Re-export SelectItem from HeroUI for convenience
export { SelectItem };
