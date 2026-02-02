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
  onDuplicate?: () => void;
  onDelete?: () => void;
  showAdminActions?: boolean;
  /** When false, the 3-dot menu is hidden (e.g. Personas page). */
  showMenu?: boolean;
  /** Primary footer button label. Default "Praticar". Use "Editar" for Personas. */
  primaryButtonLabel?: string;
  /** Primary footer button action. Defaults to onPractice when not set. */
  primaryButtonAction?: () => void;
}

export function RoleplayCard({
  roleplay,
  onPractice,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
  showAdminActions = false,
  showMenu = true,
  primaryButtonLabel = "Praticar",
  primaryButtonAction,
}: RoleplayCardProps) {
  const categoryColor = getCategoryColor(roleplay.category);
  const categoryLabel = getCategoryLabel(roleplay.category);

  const menuItems = [
    { key: "view", label: "Ver Analytics", action: onView },
    ...(showAdminActions
      ? [
          { key: "edit", label: "Editar", action: onEdit, className: "rounded-lg hover:bg-[#F9FAFB] transition-colors" },
          { key: "duplicate", label: "Duplicar", action: onDuplicate, className: "rounded-lg hover:bg-[#F9FAFB] transition-colors" },
          { key: "delete", label: "Deletar", action: onDelete, className: "text-danger rounded-lg", color: "danger" as const },
        ]
      : []),
  ];

  const onPrimaryPress = primaryButtonAction ?? onPractice;

  return (
    <Card className="bg-white border border-[#E5E7EB] rounded-2xl transition-all duration-200 card-hover overflow-hidden">
      <CardBody className="p-6 gap-4">
        {/* Header with category tag and optional menu */}
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

          {showMenu && (
            <Dropdown
              classNames={{ content: "p-1 outline-none ring-0 rounded-xl shadow-lg border border-[#E5E7EB] bg-white min-w-[160px]" }}
            >
              <DropdownTrigger>
                <Button
                  isIconOnly
                  size="sm"
                  variant="ghost"
                  className="text-[#6B7280] -mt-1 -mr-1 rounded-lg hover:bg-[#F9FAFB] transition-colors"
                  aria-label="Opções do role-play"
                >
                  <EllipsisVerticalIcon className="w-5 h-5" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Ações do role-play"
                items={menuItems}
                variant="flat"
                color="default"
                classNames={{
                  base: "p-1",
                  list: "gap-0.5",
                }}
                itemClasses={{
                  base: "rounded-lg data-[hover=true]:bg-[#F9FAFB] data-[pressed=true]:opacity-80 data-[focus-visible=true]:outline-none data-[focus-visible=true]:ring-2 data-[focus-visible=true]:ring-[#E5E7EB] data-[focus-visible=true]:ring-inset data-[focus-visible=true]:ring-offset-0",
                }}
              >
                {(item) => (
                  <DropdownItem
                    key={item.key}
                    className={item.className}
                    color={item.color}
                    onPress={item.action}
                  >
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
              <h3 className="text-lg font-semibold text-[#111827] leading-tight group-hover:text-[#3B82F6] transition-colors">
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
            src={roleplay.agent.avatar}
            name={roleplay.agent.name}
            size="sm"
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
          variant="bordered"
          className="w-full font-semibold border-2 border-[#E5E7EB] text-[#1F2937] hover:bg-[#F9FAFB] hover:border-[#D1D5DB] hover:text-[#111827] focus:bg-[#EBF0FA] rounded-xl shadow-none transition-all duration-200 min-h-[48px]"
          onPress={onPrimaryPress}
        >
          {primaryButtonLabel}
        </Button>
      </CardFooter>
    </Card>
  );
}
