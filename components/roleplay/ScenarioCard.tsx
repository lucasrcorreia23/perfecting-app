"use client";

import { Card, CardBody, CardFooter, Button, Chip } from "@heroui/react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import type { RoleplayScenario } from "@/types";

interface ScenarioCardProps {
  scenario: RoleplayScenario;
  onSelect: () => void;
}

export function ScenarioCard({ scenario, onSelect }: ScenarioCardProps) {
  return (
    <Card className="bg-white border border-[#E5E7EB] rounded-2xl transition-all duration-200 card-hover overflow-hidden">
      <CardBody className="p-6 gap-4">
        {/* Icon and Character Count */}
        <div className="flex items-start justify-between gap-2">
          <div className="text-5xl">{scenario.icon}</div>
          <Chip
            size="sm"
            variant="flat"
            className="bg-gray-100 text-gray-700 font-medium"
          >
            {scenario.characters.length} personagens
          </Chip>
        </div>

        {/* Title and description */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-[#111827] leading-tight">
            {scenario.name}
          </h3>
          <p className="text-sm text-[#6B7280] leading-relaxed">
            {scenario.description}
          </p>
        </div>

        {/* Characters preview */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#E5E7EB]">
          <div className="flex -space-x-2">
            {scenario.characters.slice(0, 3).map((character) => (
              <div
                key={character.id}
                className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 overflow-hidden"
              >
                <img
                  src={character.avatar}
                  alt={character.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <span className="text-xs text-[#6B7280]">
            {scenario.characters.slice(0, 2).map((c) => c.name).join(", ")}
            {scenario.characters.length > 2 && ` +${scenario.characters.length - 2}`}
          </span>
        </div>
      </CardBody>

      <CardFooter className="px-6 pb-6 pt-0">
        <Button
          disableRipple={false}
          variant="bordered"
          className="w-full font-semibold border-2 border-[#E5E7EB] text-[#1F2937] hover:bg-[#F9FAFB] hover:border-[#D1D5DB] hover:text-[#111827] focus:bg-[#EBF0FA] rounded-xl shadow-none transition-all duration-200 min-h-[48px]"
          onPress={onSelect}
          endContent={<ArrowRightIcon className="w-4 h-4" />}
        >
          Explorar Personagens
        </Button>
      </CardFooter>
    </Card>
  );
}
