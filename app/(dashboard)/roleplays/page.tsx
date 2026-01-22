"use client";

import { useState, useMemo } from "react";
import { Input, Chip, Button, Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";

import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon, FunnelIcon, Squares2X2Icon, ListBulletIcon, PlusIcon } from "@heroicons/react/24/outline";
import { RoleplayCard } from "@/components/roleplay";
import { mockRoleplays } from "@/lib/mock-data";
import { getCategoryLabel, getCategoryColor, cn } from "@/lib/utils";
import type { RoleplayCategory } from "@/types";

interface RoleplaysPageProps {
  userRole?: "admin" | "seller";
}

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

export default function RoleplaysPage({ userRole = "seller" }: RoleplaysPageProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [roleplayToDelete, setRoleplayToDelete] = useState<string | null>(null);

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

  const handlePractice = (roleplay: any) => {
    router.push(`/roleplays/scenario/${roleplay.scenarioSlug}`);
  };

  const handleEdit = (roleplayId: string) => {
    router.push(`/roleplays/create?edit=${roleplayId}`);
  };

  const handleDuplicate = (roleplayId: string) => {
    console.log("Duplicating roleplay:", roleplayId);
    // TODO: Implementar lógica de duplicação
    alert("Roleplay duplicado com sucesso! (Mock)");
  };

  const handleDeleteClick = (roleplayId: string) => {
    setRoleplayToDelete(roleplayId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (roleplayToDelete) {
      console.log("Deleting roleplay:", roleplayToDelete);
      // TODO: Implementar lógica de deleção
      alert("Roleplay deletado com sucesso! (Mock)");
      setDeleteModalOpen(false);
      setRoleplayToDelete(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="heading-3">Biblioteca de Role-plays</h1>
          <p className="text-[#6B7280] mt-1">
            {userRole === "admin" 
              ? "Gerencie e crie novos roleplays para sua equipe"
              : "Escolha um cenário e pratique suas habilidades de vendas"}
          </p>
        </div>

        {userRole === "admin" && (
          <Button
            className="bg-[#2E63CD] hover:bg-[#2451A8] text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
            onPress={() => router.push("/roleplays/create")}
          >
            <PlusIcon className="w-5 h-5" />
            Criar Roleplay
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <Input
          placeholder="Buscar por título, descrição ou agente..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />

        <div className="flex flex-wrap gap-4">
          <Select
            placeholder="Todas as categorias"
            selectedKeys={new Set([selectedCategory])}
            onSelectionChange={(keys) => setSelectedCategory(Array.from(keys)[0] as string)}
            className="w-48"
            aria-label="Categoria"
            radius="lg"
            classNames={{
              trigger: "min-h-[48px] !bg-white !border-2 !border-[#E5E7EB] !rounded-xl shadow-sm hover:!border-[#D1D5DB] hover:shadow-md",
              value: "text-[#1F2937] font-medium",
              innerWrapper: "py-2",
            }}
          >
            {categories.map((category) => (
              <SelectItem key={category.value}>{category.label}</SelectItem>
            ))}
          </Select>

          <Select
            placeholder="Todas as dificuldades"
            selectedKeys={new Set([selectedDifficulty])}
            onSelectionChange={(keys) => setSelectedDifficulty(Array.from(keys)[0] as string)}
            className="w-48"
            aria-label="Dificuldade"
            radius="lg"
            classNames={{
              trigger: "min-h-[48px] !bg-white !border-2 !border-[#E5E7EB] !rounded-xl shadow-sm hover:!border-[#D1D5DB] hover:shadow-md",
              value: "text-[#1F2937] font-medium",
              innerWrapper: "py-2",
            }}
          >
            {difficulties.map((difficulty) => (
              <SelectItem key={difficulty.value}>{difficulty.label}</SelectItem>
            ))}
          </Select>

          {/* View mode toggle */}
         
        </div>
      </div>

      {/* Active filters */}
      {(selectedCategory !== "all" || selectedDifficulty !== "all" || searchQuery) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-[#6B7280]">Filtros ativos:</span>
          {searchQuery && (
            <Chip
              variant="flat"
              color="primary"
              size="sm"
            >
              Busca: {searchQuery}
            </Chip>
          )}
          {selectedCategory !== "all" && (
            <Chip
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
              variant="flat"
              color="default"
              size="sm"
            >
              {difficulties.find((d) => d.value === selectedDifficulty)?.label}
            </Chip>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="text-[#6B7280] rounded-lg hover:bg-[#F9FAFB] transition-colors"
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
              onPractice={() => handlePractice(roleplay)}
              onView={() => router.push(`/roleplays/${roleplay.id}/analytics`)}
              onEdit={userRole === "admin" ? () => handleEdit(roleplay.id) : undefined}
              onDuplicate={userRole === "admin" ? () => handleDuplicate(roleplay.id) : undefined}
              onDelete={userRole === "admin" ? () => handleDeleteClick(roleplay.id) : undefined}
              showAdminActions={userRole === "admin"}
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
            className="border border-[#E5E7EB] text-[#6B7280] rounded-xl hover:bg-[#F9FAFB] hover:border-[#D1D5DB] hover:text-[#374151] transition-all duration-200"
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        backdrop="opaque"
        classNames={{
          backdrop: "bg-[#111827]/50 backdrop-blur-sm",
        }}
      >
        <ModalContent className="bg-white border-2 border-[#E5E7EB] rounded-2xl shadow-xl">
          <ModalHeader className="border-b border-[#E5E7EB] px-6 py-4">
            <h3 className="text-xl font-semibold text-[#111827]">Confirmar Exclusão</h3>
          </ModalHeader>
          <ModalBody className="py-6 px-6">
            <p className="text-[#1F2937]">
              Tem certeza que deseja deletar este roleplay? Esta ação não pode ser desfeita.
            </p>
          </ModalBody>
          <ModalFooter className="border-t border-[#E5E7EB] px-6 py-4">
            <Button
              variant="ghost"
              className="rounded-lg hover:bg-[#F9FAFB] transition-colors text-[#6B7280] font-medium"
              onPress={() => setDeleteModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              className="bg-[#EF4444] hover:bg-[#DC2626] text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 min-h-[48px]"
              onPress={handleDeleteConfirm}
            >
              Deletar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
 