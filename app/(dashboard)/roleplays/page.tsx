"use client";

import { useState, useMemo } from "react";
import { Input, Select, SelectItem, Chip, Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon, FunnelIcon, Squares2X2Icon, ListBulletIcon } from "@heroicons/react/24/outline";
import { RoleplayCard } from "@/components/roleplay";
import { mockRoleplays } from "@/lib/mock-data";
import { getCategoryLabel, getCategoryColor } from "@/lib/utils";
import type { RoleplayCategory } from "@/types";

const categories: { value: RoleplayCategory | "all"; label: string }[] = [
  { value: "all", label: "Todas as categorias" },
  { value: "behavioral", label: "Comportamental" },
  { value: "technical", label: "Técnico" },
  { value: "objection", label: "Objeções" },
  { value: "closing", label: "Fechamento" },
  { value: "custom", label: "Personalizado" },
];

const difficulties = [
  { value: "all", label: "Todas as dificuldades" },
  { value: "beginner", label: "Iniciante" },
  { value: "intermediate", label: "Intermediário" },
  { value: "advanced", label: "Avançado" },
];

export default function RoleplaysPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredRoleplays = useMemo(() => {
    return mockRoleplays.filter((roleplay) => {
      const matchesSearch =
        roleplay.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        roleplay.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        roleplay.agent.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || roleplay.category === selectedCategory;

      const matchesDifficulty =
        selectedDifficulty === "all" || roleplay.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  const handlePractice = (roleplayId: string) => {
    router.push(`/roleplays/${roleplayId}/practice`);
  };

  const handleView = (roleplayId: string) => {
    router.push(`/roleplays/${roleplayId}`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="heading-2">Biblioteca de Role-plays</h1>
        <p className="text-[#6B7280] mt-1">
          Escolha um cenário e pratique suas habilidades de vendas
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <Input
          placeholder="Buscar por título, descrição ou agente..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          startContent={<MagnifyingGlassIcon className="w-5 h-5 text-[#6B7280]" />}
          variant="bordered"
          className="max-w-md"
        />

        <div className="flex flex-wrap gap-4">
          <Select
            placeholder="Categoria"
            selectedKeys={[selectedCategory]}
            onSelectionChange={(keys) => setSelectedCategory(Array.from(keys)[0] as string)}
            variant="bordered"
            className="w-48"
            startContent={<FunnelIcon className="w-4 h-4 text-[#6B7280]" />}
          >
            {categories.map((category) => (
              <SelectItem key={category.value}>{category.label}</SelectItem>
            ))}
          </Select>

          <Select
            placeholder="Dificuldade"
            selectedKeys={[selectedDifficulty]}
            onSelectionChange={(keys) => setSelectedDifficulty(Array.from(keys)[0] as string)}
            variant="bordered"
            className="w-48"
          >
            {difficulties.map((difficulty) => (
              <SelectItem key={difficulty.value}>{difficulty.label}</SelectItem>
            ))}
          </Select>

          {/* View mode toggle */}
          <div className="flex items-center border border-[#E5E7EB] rounded-lg overflow-hidden">
            <Button
              isIconOnly
              variant={viewMode === "grid" ? "solid" : "light"}
              className={viewMode === "grid" ? "bg-[#2E63CD] text-white" : "text-[#6B7280]"}
              onPress={() => setViewMode("grid")}
              radius="none"
            >
              <Squares2X2Icon className="w-5 h-5" />
            </Button>
            <Button
              isIconOnly
              variant={viewMode === "list" ? "solid" : "light"}
              className={viewMode === "list" ? "bg-[#2E63CD] text-white" : "text-[#6B7280]"}
              onPress={() => setViewMode("list")}
              radius="none"
            >
              <ListBulletIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Active filters */}
      {(selectedCategory !== "all" || selectedDifficulty !== "all" || searchQuery) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-[#6B7280]">Filtros ativos:</span>
          {searchQuery && (
            <Chip
              onClose={() => setSearchQuery("")}
              variant="flat"
              color="primary"
              size="sm"
            >
              Busca: {searchQuery}
            </Chip>
          )}
          {selectedCategory !== "all" && (
            <Chip
              onClose={() => setSelectedCategory("all")}
              variant="flat"
              size="sm"
              style={{
                backgroundColor: `${getCategoryColor(selectedCategory)}15`,
                color: getCategoryColor(selectedCategory),
              }}
            >
              {getCategoryLabel(selectedCategory)}
            </Chip>
          )}
          {selectedDifficulty !== "all" && (
            <Chip
              onClose={() => setSelectedDifficulty("all")}
              variant="flat"
              color="default"
              size="sm"
            >
              {difficulties.find((d) => d.value === selectedDifficulty)?.label}
            </Chip>
          )}
          <Button
            size="sm"
            variant="light"
            className="text-[#6B7280]"
            onPress={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedDifficulty("all");
            }}
          >
            Limpar filtros
          </Button>
        </div>
      )}

      {/* Results count */}
      <div className="text-sm text-[#6B7280]">
        {filteredRoleplays.length} role-play{filteredRoleplays.length !== 1 && "s"} encontrado{filteredRoleplays.length !== 1 && "s"}
      </div>

      {/* Roleplay grid */}
      {filteredRoleplays.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredRoleplays.map((roleplay) => (
            <RoleplayCard
              key={roleplay.id}
              roleplay={roleplay}
              onPractice={() => handlePractice(roleplay.id)}
              onView={() => handleView(roleplay.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-[#111827] mb-2">
            Nenhum role-play encontrado
          </h3>
          <p className="text-[#6B7280] mb-4">
            Tente ajustar os filtros ou buscar por outros termos
          </p>
          <Button
            variant="bordered"
            className="border-[#2E63CD] text-[#2E63CD]"
            onPress={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedDifficulty("all");
            }}
          >
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  );
}
 