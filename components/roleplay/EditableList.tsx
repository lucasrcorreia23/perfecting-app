"use client";

import { useState } from "react";
import { Button, Input } from "@heroui/react";
import { PlusIcon, XMarkIcon, PencilIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface EditableListProps {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  addButtonText?: string;
  emptyMessage?: string;
  maxItems?: number;
}

export function EditableList({
  items,
  onChange,
  placeholder = "Adicionar item...",
  addButtonText = "Adicionar",
  emptyMessage = "Nenhum item adicionado ainda",
  maxItems,
}: EditableListProps) {
  const [newItem, setNewItem] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleAdd = () => {
    const trimmedItem = newItem.trim();
    if (trimmedItem && (!maxItems || items.length < maxItems)) {
      onChange([...items, trimmedItem]);
      setNewItem("");
    }
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(items[index]);
  };

  const handleSaveEdit = (index: number) => {
    const trimmedValue = editValue.trim();
    if (trimmedValue) {
      const newItems = [...items];
      newItems[index] = trimmedValue;
      onChange(newItems);
    }
    setEditingIndex(null);
    setEditValue("");
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="space-y-3">
      {/* Input para adicionar novo item */}
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, handleAdd)}
          variant="bordered"
          radius="lg"
          disabled={maxItems ? items.length >= maxItems : false}
          classNames={{
            input: "text-[#1F2937]",
            inputWrapper: "border-2 border-[#E5E7EB] hover:border-[#2E63CD] rounded-xl min-h-[48px]",
          }}
        />
        <Button
          className="bg-[#2E63CD] hover:bg-[#2451A8] text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200 min-h-[48px] px-6"
          onPress={handleAdd}
          isDisabled={!newItem.trim() || (maxItems ? items.length >= maxItems : false)}
        >
          <PlusIcon className="w-5 h-5" />
          {addButtonText}
        </Button>
      </div>

      {/* Lista de itens */}
      {items.length > 0 ? (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200",
                editingIndex === index
                  ? "border-[#2E63CD] bg-[#EBF0FA]"
                  : "border-[#E5E7EB] bg-white hover:border-[#D1D5DB]"
              )}
            >
              {/* Drag handle (visual only for now) */}
              <button
                className="cursor-grab text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                aria-label="Reordenar"
              >
                <Bars3Icon className="w-5 h-5" />
              </button>

              {/* Conteúdo do item */}
              {editingIndex === index ? (
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSaveEdit(index);
                    } else if (e.key === "Escape") {
                      handleCancelEdit();
                    }
                  }}
                  autoFocus
                  variant="bordered"
                  radius="lg"
                  classNames={{
                    input: "text-[#1F2937]",
                    inputWrapper: "border-2 border-[#2E63CD] rounded-lg min-h-[40px]",
                  }}
                />
              ) : (
                <span className="flex-1 text-[#1F2937]">{item}</span>
              )}

              {/* Ações */}
              <div className="flex items-center gap-1">
                {editingIndex === index ? (
                  <>
                    <Button
                      size="sm"
                      variant="flat"
                      color="success"
                      className="rounded-lg min-w-[60px]"
                      onPress={() => handleSaveEdit(index)}
                    >
                      Salvar
                    </Button>
                    <Button
                      size="sm"
                      variant="flat"
                      className="rounded-lg"
                      onPress={handleCancelEdit}
                    >
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      className="rounded-lg text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#2E63CD]"
                      onPress={() => handleEdit(index)}
                      aria-label="Editar"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      className="rounded-lg text-[#6B7280] hover:bg-[#FEE2E2] hover:text-[#EF4444]"
                      onPress={() => handleRemove(index)}
                      aria-label="Remover"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 px-4 bg-[#F9FAFB] rounded-xl border-2 border-dashed border-[#E5E7EB]">
          <p className="text-sm text-[#6B7280]">{emptyMessage}</p>
        </div>
      )}

      {/* Contador de itens */}
      {maxItems && (
        <p className="text-xs text-[#6B7280] text-right">
          {items.length}/{maxItems} itens
        </p>
      )}
    </div>
  );
}
