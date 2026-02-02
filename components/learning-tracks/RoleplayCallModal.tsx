"use client";

import { useRouter } from "next/navigation";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Avatar,
} from "@heroui/react";
import { PhoneXMarkIcon } from "@heroicons/react/24/outline";
import { LearningTrack, LearningModule } from "@/types";

interface RoleplayCallModalProps {
  track: LearningTrack | null;
  module: LearningModule | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RoleplayCallModal({
  track,
  module,
  isOpen,
  onClose,
}: RoleplayCallModalProps) {
  const router = useRouter();

  if (!track || !module) return null;

  const handleEndCall = () => {
    onClose();
  };

  const handleOpenFullRoleplay = () => {
    onClose();
    if (module.scenarioSlug && module.characterId) {
      router.push(
        `/roleplays/scenario/${module.scenarioSlug}?character=${module.characterId}&trackId=${track.id}`
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      backdrop="blur"
      classNames={{
        base: "mx-4 bg-white",
        wrapper: "items-center",
        body: "py-6",
        header: "border-b border-[#E5E7EB]",
        footer: "border-t border-[#E5E7EB] bg-[#F9FAFB]",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <span className="text-sm font-normal text-[#6B7280]">Chamada — {track.title}</span>
          <h2 className="text-xl font-semibold text-[#111827]">{module.title}</h2>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="w-20 h-20 rounded-full bg-[#EBF0FA] flex items-center justify-center">
              <Avatar
                name={module.title}
                className="w-16 h-16 text-2xl bg-[#2E63CD] text-white"
              />
            </div>
            <p className="text-[#6B7280] text-sm text-center">
              Chamada com o roleplay da trilha. Aqui você pode praticar o que aprendeu nos módulos anteriores.
            </p>
            <p className="text-xs text-[#9CA3AF]">
              Em breve: áudio e vídeo integrados. Por agora, use o botão abaixo para abrir a tela completa de roleplay.
            </p>
          </div>
        </ModalBody>
        <ModalFooter className="flex flex-col sm:flex-row gap-2">
          {module.scenarioSlug && module.characterId && (
            <Button
              className="flex-1 bg-[#2E63CD] hover:bg-[#2451A8] text-white font-medium rounded-xl"
              onPress={handleOpenFullRoleplay}
            >
              Abrir tela de roleplay
            </Button>
          )}
          <Button
            variant="bordered"
            className="flex-1 border-[#EF4444] text-[#EF4444] hover:bg-[#FEE2E2] font-medium rounded-xl"
            onPress={handleEndCall}
            startContent={<PhoneXMarkIcon className="w-5 h-5" />}
          >
            Encerrar chamada
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
