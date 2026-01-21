"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardBody, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Chip } from "@heroui/react";
import { ArrowLeftIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { VoiceInterface } from "@/components/roleplay";
import { mockRoleplays } from "@/lib/mock-data";
import { getCategoryColor, getCategoryLabel } from "@/lib/utils";

export default function PracticePage() {
  const params = useParams();
  const router = useRouter();
  const roleplayId = params.id as string;

  const [roleplay, setRoleplay] = useState(mockRoleplays.find((r) => r.id === roleplayId));
  const [showEndModal, setShowEndModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(true);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [transcript, setTranscript] = useState<{ speaker: "user" | "agent"; content: string }[]>([]);

  useEffect(() => {
    if (!roleplay) {
      router.push("/roleplays");
    }
  }, [roleplay, router]);

  if (!roleplay) {
    return null;
  }

  const handleStartSession = () => {
    setShowInfoModal(false);
    setSessionStarted(true);
  };

  const handleEndSession = () => {
    setShowEndModal(true);
  };

  const handleConfirmEnd = () => {
    // In a real app, you would save the session and generate feedback
    router.push(`/roleplays/${roleplayId}/feedback`);
  };

  const handleTranscriptUpdate = (newTranscript: { speaker: "user" | "agent"; content: string }[]) => {
    setTranscript(newTranscript);
  };

  const categoryColor = getCategoryColor(roleplay.category);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            isIconOnly
            variant="light"
            onPress={() => router.back()}
            className="text-[#6B7280]"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="heading-3">{roleplay.title}</h1>
              <Chip
                size="sm"
                variant="flat"
                style={{
                  backgroundColor: `${categoryColor}15`,
                  color: categoryColor,
                }}
              >
                {getCategoryLabel(roleplay.category)}
              </Chip>
            </div>
            <p className="text-sm text-[#6B7280]">
              Praticando com {roleplay.agent.name}
            </p>
          </div>
        </div>

        <Button
          variant="light"
          startContent={<InformationCircleIcon className="w-5 h-5" />}
          onPress={() => setShowInfoModal(true)}
          className="text-[#6B7280]"
        >
          Ver instruções
        </Button>
      </div>

      {/* Main content */}
      <Card className="flex-1 bg-white border border-[#E5E7EB] rounded-2xl">
        <CardBody className="p-0 relative">
          {sessionStarted ? (
            <VoiceInterface
              agent={roleplay.agent}
              onEnd={handleEndSession}
              onTranscriptUpdate={handleTranscriptUpdate}
            />
          ) : (
            <div className="flex items-center justify-center h-full min-h-[500px]">
              <div className="text-center space-y-4">
                <div className="text-6xl">🎯</div>
                <h2 className="text-xl font-semibold text-[#111827]">
                  Pronto para começar?
                </h2>
                <p className="text-[#6B7280] max-w-md">
                  Clique no botão abaixo para iniciar sua sessão de prática com {roleplay.agent.name}
                </p>
                <Button
                  color="primary"
                  size="lg"
                  className="bg-[#2E63CD] hover:bg-[#2451A8] mt-4"
                  onPress={handleStartSession}
                >
                  Iniciar Sessão
                </Button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Info Modal */}
      <Modal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        size="lg"
      >
        <ModalContent>
          <ModalHeader className="border-b border-[#E5E7EB]">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full bg-cover bg-center"
                style={{ backgroundImage: `url(${roleplay.agent.avatar})` }}
              />
              <div>
                <h3 className="text-lg font-semibold text-[#111827]">
                  {roleplay.title}
                </h3>
                <p className="text-sm text-[#6B7280]">
                  {roleplay.agent.name} • {roleplay.agent.role}
                </p>
              </div>
            </div>
          </ModalHeader>
          <ModalBody className="py-6">
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-[#111827] mb-2">Contexto</h4>
                <p className="text-sm text-[#6B7280]">{roleplay.agent.context}</p>
              </div>

              <div>
                <h4 className="font-semibold text-[#111827] mb-2">Personalidade do Agente</h4>
                <p className="text-sm text-[#6B7280]">{roleplay.agent.personality}</p>
              </div>

              <div>
                <h4 className="font-semibold text-[#111827] mb-2">Objetivos</h4>
                <ul className="space-y-2">
                  {roleplay.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-[#6B7280]">
                      <span className="w-5 h-5 rounded-full bg-[#EBF0FA] text-[#2E63CD] flex items-center justify-center flex-shrink-0 text-xs font-medium">
                        {index + 1}
                      </span>
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-[#111827] mb-2">Dicas</h4>
                <ul className="space-y-1 text-sm text-[#6B7280]">
                  <li>• Fale de forma clara e natural</li>
                  <li>• Aguarde o agente terminar de falar antes de responder</li>
                  <li>• Você pode pausar a qualquer momento</li>
                  <li>• O feedback será gerado ao final da sessão</li>
                </ul>
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="border-t border-[#E5E7EB]">
            <Button
              color="primary"
              className="bg-[#2E63CD] hover:bg-[#2451A8]"
              onPress={handleStartSession}
            >
              Começar Prática
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* End Session Modal */}
      <Modal
        isOpen={showEndModal}
        onClose={() => setShowEndModal(false)}
      >
        <ModalContent>
          <ModalHeader className="border-b border-[#E5E7EB]">
            Encerrar Sessão
          </ModalHeader>
          <ModalBody className="py-6">
            <p className="text-[#6B7280]">
              Deseja realmente encerrar esta sessão de prática? Seu feedback será gerado com base na conversa realizada.
            </p>
          </ModalBody>
          <ModalFooter className="border-t border-[#E5E7EB]">
            <Button
              variant="light"
              onPress={() => setShowEndModal(false)}
            >
              Continuar Praticando
            </Button>
            <Button
              color="primary"
              className="bg-[#2E63CD] hover:bg-[#2451A8]"
              onPress={handleConfirmEnd}
            >
              Ver Feedback
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
