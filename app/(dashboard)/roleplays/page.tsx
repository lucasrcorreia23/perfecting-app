"use client";

import { useState, useMemo } from "react";
import { Input, Chip, Button, Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";

import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon, FunnelIcon, Squares2X2Icon, ListBulletIcon, PlusIcon } from "@heroicons/react/24/outline";
import { RoleplayCard } from "@/components/roleplay";
import { mockScenarios } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { RoleplayCharacter } from "@/types";
import { useAuth } from "@/contexts";

// Criar lista de todos os personagens com informação do cenário
const allCharacters = mockScenarios.flatMap(scenario => 
  scenario.characters.map(character => ({
    ...character,
    scenarioName: scenario.name,
    scenarioSlug: scenario.slug,
    scenarioIcon: scenario.icon,
    scenarioColor: scenario.color,
  }))
);

export default function RoleplaysPage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedScenario, setSelectedScenario] = useState<string>("all");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [characterToDelete, setCharacterToDelete] = useState<string | null>(null);

  const filteredCharacters = useMemo(() => {
    return allCharacters.filter((character) => {
      const matchesSearch =
        character.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        character.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        character.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        character.scenarioName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesScenario =
        selectedScenario === "all" || character.scenarioSlug === selectedScenario;

      return matchesSearch && matchesScenario;
    });
  }, [searchQuery, selectedScenario]);

  const handlePracticeCharacter = (character: any) => {
    // Redireciona para a página do cenário com o personagem
    router.push(`/roleplays/scenario/${character.scenarioSlug}?character=${character.id}`);
  };

  const handleDeleteClick = (characterId: string) => {
    setCharacterToDelete(characterId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (characterToDelete) {
      console.log("Deleting character:", characterToDelete);
      // TODO: Implementar lógica de deleção
      alert("Personagem deletado com sucesso! (Mock)");
      setDeleteModalOpen(false);
      setCharacterToDelete(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="heading-3">Biblioteca de Personagens</h1>
          <p className="text-[#6B7280] mt-1">
            {isAdmin
              ? "Gerencie personagens de todos os cenários"
              : "Escolha um personagem e pratique suas habilidades"}
          </p>
        </div>

        {isAdmin && (
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
          {/* Filtro de Cenários */}
          <Select
            placeholder="Todos os cenários"
            selectedKeys={new Set([selectedScenario])}
            onSelectionChange={(keys) => setSelectedScenario(Array.from(keys)[0] as string)}
            className="w-56"
            aria-label="Cenário"
            radius="lg"
            classNames={{
              trigger: "min-h-[48px] !bg-white !border-2 !border-[#E5E7EB] !rounded-xl shadow-sm hover:!border-[#D1D5DB] hover:shadow-md",
              value: "text-[#1F2937] font-medium",
              innerWrapper: "py-2",
            }}
            items={[
              { value: "all", label: "Todos os cenários" },
              ...mockScenarios.map(s => ({ value: s.slug, label: `${s.icon} ${s.name}` }))
            ]}
          >
            {(item: any) => (
              <SelectItem key={item.value}>
                {item.label}
              </SelectItem>
            )}
          </Select>
        </div>
      </div>

      {/* Active filters */}
      {(selectedScenario !== "all" || searchQuery) && (
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
          {selectedScenario !== "all" && (
            <Chip
              variant="flat"
              size="sm"
              className="bg-blue-50 text-blue-700"
            >
              {mockScenarios.find((s) => s.slug === selectedScenario)?.icon}{" "}
              {mockScenarios.find((s) => s.slug === selectedScenario)?.name}
            </Chip>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="text-[#6B7280] rounded-lg hover:bg-[#F9FAFB] transition-colors"
            onPress={() => {
              setSearchQuery("");
              setSelectedScenario("all");
            }}
          >
            Limpar filtros
          </Button>
        </div>
      )}

      {/* Results count */}
      <div className="text-sm text-[#6B7280]">
        {filteredCharacters.length} personagem{filteredCharacters.length !== 1 && "s"} encontrado{filteredCharacters.length !== 1 && "s"}
      </div>

      {/* Characters grid */}
      {filteredCharacters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCharacters.map((character) => (
            <RoleplayCard
              key={character.id}
              roleplay={{
                id: character.id,
                title: character.name,
                description: `${character.role} - ${character.company}. ${character.context}`,
                category: "custom",
                difficulty: character.difficulty,
                estimatedDuration: 15,
                agent: {
                  id: character.id,
                  name: character.name,
                  role: character.role,
                  avatar: character.avatar,
                  voiceId: character.voiceId,
                  personality: character.personality,
                  context: character.context,
                },
                scenarioSlug: character.scenarioSlug,
                objectives: character.objectives || [],
                tags: [character.scenarioName],
                createdBy: "system",
                createdAt: new Date(),
                updatedAt: new Date(),
              }}
              onPractice={() => handlePracticeCharacter(character)}
              showAdminActions={false}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-[#111827] mb-2">
            Nenhum personagem encontrado
          </h3>
          <p className="text-[#6B7280] mb-4">
            Tente ajustar os filtros ou buscar por outros termos
          </p>
          <Button
            variant="bordered"
            className="border border-[#E5E7EB] text-[#6B7280] rounded-xl hover:bg-[#F9FAFB] hover:border-[#D1D5DB] hover:text-[#374151] transition-all duration-200"
            onPress={() => {
              setSearchQuery("");
              setSelectedScenario("all");
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
              Tem certeza que deseja deletar este personagem? Esta ação não pode ser desfeita.
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
 
 