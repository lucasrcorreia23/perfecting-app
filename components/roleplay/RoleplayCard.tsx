"use client";

import { Card, CardBody, CardFooter, Button, Chip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from "@heroui/react";
import { EllipsisVerticalIcon, ClockIcon } from "@heroicons/react/24/outline";
import { getCategoryColor, getCategoryLabel, truncateText } from "@/lib/utils";
import type { Roleplay } from "@/types";

interface RoleplayCardProps {
  roleplay: Roleplay;
  onPractice?: () => void;
  onView?: () => void;
  onEdit?: () => void;
  showActions?: boolean;
}

export function RoleplayCard({
  roleplay,
  onPractice,
  onView,
  onEdit,
  showActions = true,
}: RoleplayCardProps) {
  const categoryColor = getCategoryColor(roleplay.category);
  const categoryLabel = getCategoryLabel(roleplay.category);

  return (
    <Card className="bg-white border border-[#E5E7EB] rounded-2xl transition-all duration-200 card-hover overflow-hidden">
      <CardBody className="p-6 gap-4">
        {/* Header with category tag and menu */}
        <div className="flex items-start justify-between gap-2">
          <Chip
            size="sm"
            variant="flat"
            style={{
              backgroundColor: `${categoryColor}15`,
              color: categoryColor,
            }}
            className="font-medium text-xs uppercase tracking-wider px-2"
          >
            {categoryLabel}
          </Chip>

          {showActions && (
            <Dropdown >
              <DropdownTrigger>
                <Button
                  isIconOnly
                  size="sm"
                  variant="ghost"
                  className="text-[#6B7280] -mt-1 -mr-1"
                  aria-label="Opções do role-play"
                >
                  <EllipsisVerticalIcon className="w-5 h-5" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Ações do role-play"
                items={[
                  { key: "view", label: "Ver detalhes", action: onView },
                  ...(onEdit ? [{ key: "edit", label: "Editar", action: onEdit }] : []),
                ]}
              >
                {(item) => (
                  <DropdownItem key={item.key} onPress={item.action}>
                    {item.label}
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          )}
        </div>

        {/* Title and description */}
        <div className="space-y-2">
          {onView ? (
            <button
              onClick={onView}
              className="text-left w-full group"
            >
              <h3 className="text-lg font-semibold text-[#111827] leading-tight group-hover:text-[#2E63CD] transition-colors">
                {roleplay.title}
              </h3>
            </button>
          ) : (
            <h3 className="text-lg font-semibold text-[#111827] leading-tight">
              {roleplay.title}
            </h3>
          )}
          <p className="text-sm text-[#6B7280] leading-relaxed">
            {truncateText(roleplay.description, 100)}
          </p>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-1.5 text-[#6B7280]">
          <ClockIcon className="w-4 h-4" />
          <span className="text-xs">{roleplay.estimatedDuration} min</span>
        </div>

        {/* Agent info */}
        <div className="flex items-center gap-3 pt-2 border-t border-[#E5E7EB]">
          <Avatar
            name={roleplay.agent.name}
            size="sm"
            className="ring-2 ring-offset-2"
            style={{
              ["--tw-ring-color" as string]: categoryColor,
            }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#1F2937] truncate">
              {roleplay.agent.name}
            </p>
            <p className="text-xs text-[#6B7280] truncate">
              {roleplay.agent.role}
            </p>
          </div>
        </div>
      </CardBody>

      <CardFooter className="px-6 pb-6 pt-0">
        <Button
          disableRipple={false}
          className="w-full font-medium bg-[#2E63CD] hover:bg-[#2451A8] text-white"
          onPress={onPractice}
        >
          Praticar
        </Button>
      </CardFooter>
    </Card>
  );
}
