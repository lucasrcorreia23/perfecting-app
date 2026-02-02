"use client";

import { useRouter } from "next/navigation";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
  Progress,
} from "@heroui/react";
import {
  ClockIcon,
  AcademicCapIcon,
  PlayCircleIcon,
  CheckCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";
import Image from "next/image";
import { LearningTrack, LearningModule, ModuleStatus } from "@/types";
import { cn } from "@/lib/utils";
import { calculateTrackProgress } from "@/lib/learning-tracks-data";

interface TrackDetailsModalProps {
  track: LearningTrack | null;
  isOpen: boolean;
  onClose: () => void;
  onStartModule: (track: LearningTrack, module: LearningModule) => void;
}

const statusConfig: Record<ModuleStatus, { label: string; color: "default" | "primary" | "success"; icon: React.ElementType }> = {
  not_started: {
    label: "Não iniciado",
    color: "default",
    icon: PlayCircleIcon,
  },
  in_progress: {
    label: "Em progresso",
    color: "primary",
    icon: PlayCircleIcon,
  },
  completed: {
    label: "Concluído",
    color: "success",
    icon: CheckCircleSolid,
  },
};

export function TrackDetailsModal({
  track,
  isOpen,
  onClose,
  onStartModule,
}: TrackDetailsModalProps) {
  const router = useRouter();
  
  if (!track) return null;

  const progress = calculateTrackProgress(track);
  const completedModules = track.modules.filter((m) => m.status === "completed").length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
      backdrop="blur"
      classNames={{
        base: "mx-4 md:mx-0 bg-white",
        wrapper: "items-end md:items-center",
        body: "p-0",
        header: "p-0 border-0",
        footer: "border-t border-[#E5E7EB] bg-[#F9FAFB] p-4",
        closeButton: "hidden",
        backdrop: "bg-black/40 backdrop-blur-sm",
      }}
      aria-labelledby="track-modal-title"
    >
      <ModalContent className="rounded-t-2xl md:rounded-2xl max-h-[90vh] md:max-h-[85vh] overflow-hidden">
        {() => (
          <>
            {/* Banner with image */}
            <ModalHeader className="relative flex-shrink-0">
              <div className="relative w-full h-48 md:h-56">
                {/* Image */}
                <Image
                  src={track.coverImage}
                  alt={track.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 672px"
                  priority
                />

                {/* Inner shadow for depth */}
                <div className="absolute inset-0 shadow-[inset_0_-100px_80px_-50px_rgba(0,0,0,0.8)]" />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors z-20"
                  aria-label="Fechar modal"
                >
                  <XMarkIcon className="w-5 h-5 text-white" />
                </button>

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <h2 id="track-modal-title" className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                    {track.title}
                  </h2>

                  <p className="text-white/90 text-sm md:text-base line-clamp-2 mb-4 drop-shadow-md">
                    {track.description}
                  </p>

                  {/* Meta info */}
                  <div className="flex flex-wrap items-center gap-4 text-white text-sm font-medium">
                    <div className="flex items-center gap-1.5">
                      <ClockIcon className="w-4 h-4" />
                      <span>{track.estimatedTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <AcademicCapIcon className="w-4 h-4" />
                      <span>{track.modules.length} módulos</span>
                    </div>
                    {progress > 0 && (
                      <div className="flex items-center gap-1.5">
                        <CheckCircleIcon className="w-4 h-4" />
                        <span>{completedModules}/{track.modules.length} completos</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ModalHeader>

            <ModalBody className="px-6 py-5 bg-white">
              {/* Progress section */}
              {progress > 0 && (
                <div className="mb-6 p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-[#4B5563] font-medium">Seu progresso</span>
                    <span className="font-bold text-[#2E63CD]">{progress}%</span>
                  </div>
                  <Progress
                    value={progress}
                    color="primary"
                    size="md"
                    className="h-2.5"
                    aria-label={`Progresso da trilha: ${progress}%`}
                  />
                </div>
              )}

              {/* Modules preview list */}
              <div>
                <h3 className="text-lg font-bold text-[#111827] mb-4">
                  Módulos da Trilha
                </h3>

                <div className="space-y-2">
                  {track.modules.slice(0, 4).map((module, index) => {
                    const status = statusConfig[module.status];
                    const isCompleted = module.status === "completed";

                    return (
                      <div
                        key={module.id}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl transition-all duration-200",
                          isCompleted
                            ? "bg-[#ECFDF5] border border-[#10B981]/30"
                            : "bg-[#F9FAFB] border border-[#E5E7EB] hover:border-[#D1D5DB]"
                        )}
                      >
                        {/* Module number or check */}
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                            isCompleted
                              ? "bg-[#10B981] text-white"
                              : "bg-white border-2 border-[#E5E7EB] text-[#6B7280]"
                          )}
                          aria-hidden="true"
                        >
                          {isCompleted ? (
                            <CheckCircleSolid className="w-4 h-4" />
                          ) : (
                            <span className="font-bold text-xs">{index + 1}</span>
                          )}
                        </div>

                        {/* Module content */}
                        <div className="flex-1 min-w-0">
                          <h4 className={cn(
                            "font-medium text-sm",
                            isCompleted ? "text-[#059669]" : "text-[#111827]"
                          )}>
                            {module.title}
                          </h4>
                          <p className="text-xs text-[#6B7280]">
                            {module.duration}
                          </p>
                        </div>

                      </div>
                    );
                  })}

                  {track.modules.length > 4 && (
                    <p className="text-sm text-[#6B7280] text-center py-2">
                      + {track.modules.length - 4} módulos adicionais
                    </p>
                  )}
                </div>
              </div>
            </ModalBody>

            <ModalFooter className="flex-col sm:flex-row gap-3">
              <Button
                className="flex-1 btn-cta"
                onPress={() => {
                  onClose();
                  router.push(`/trilhas/${track.slug}`);
                }}
                aria-label={progress > 0 ? "Continuar trilha" : "Iniciar trilha"}
              >
                {progress > 0 ? "Continuar Trilha" : "Iniciar Trilha"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
