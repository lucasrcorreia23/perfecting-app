"use client";

import { use, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardBody, CardHeader, Button, Input, Textarea } from "@heroui/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { mockScenarios } from "@/lib/mock-data";

interface EditPersonaPageProps {
  params: Promise<{ id: string }>;
}

const allCharacters = mockScenarios.flatMap((scenario) =>
  scenario.characters.map((character) => ({
    ...character,
    scenarioName: scenario.name,
    scenarioSlug: scenario.slug,
  }))
);

export default function EditPersonaPage({ params }: EditPersonaPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const character = useMemo(() => allCharacters.find((c) => c.id === id), [id]);

  if (!character) {
    return (
      <div className="animate-fade-in">
        <p className="text-[#6B7280]">Persona não encontrada.</p>
        <Link href="/roleplays">
          <Button variant="bordered" className="mt-4">
            Voltar para Personas
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <Link
        href="/roleplays"
        className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#111827] transition-colors font-medium"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Voltar para Personas
      </Link>

      <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
        <CardHeader className="px-6 py-4 border-b border-[#E5E7EB]">
          <h1 className="text-xl font-semibold text-[#111827]">
            Editar contexto da persona: {character.name}
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Ajuste o contexto e a personalidade para reutilizar esta persona em outros cenários.
          </p>
        </CardHeader>
        <CardBody className="p-6 space-y-4">
          <Input
            label="Nome"
            value={character.name}
            isReadOnly
            classNames={{ inputWrapper: "border border-[#E5E7EB] rounded-xl" }}
          />
          <Input
            label="Cargo"
            value={character.role}
            isReadOnly
            classNames={{ inputWrapper: "border border-[#E5E7EB] rounded-xl" }}
          />
          <Textarea
            label="Contexto"
            placeholder="Contexto da persona para o cenário..."
            defaultValue={character.context}
            minRows={4}
            classNames={{ inputWrapper: "border border-[#E5E7EB] rounded-xl" }}
          />
          <Textarea
            label="Personalidade"
            placeholder="Traços de personalidade..."
            defaultValue={character.personality}
            minRows={3}
            classNames={{ inputWrapper: "border border-[#E5E7EB] rounded-xl" }}
          />
          <div className="flex gap-3 pt-2">
            <Button
              className="bg-[#2E63CD] hover:bg-[#2451A8] text-white font-medium rounded-xl"
              onPress={() => {
                // TODO: persist and redirect
                router.push("/roleplays");
              }}
            >
              Salvar alterações
            </Button>
            <Button
              variant="bordered"
              className="border-[#E5E7EB] rounded-xl"
              onPress={() => router.push("/roleplays")}
            >
              Cancelar
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
