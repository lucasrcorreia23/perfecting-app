"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Button,
  Chip,
  Progress,
  Accordion,
  AccordionItem,
  addToast,
} from "@heroui/react";
import {
  ArrowLeftIcon,
  ClockIcon,
  AcademicCapIcon,
  PlayCircleIcon,
  CheckCircleIcon,
  PlayIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";
import {
  getTrackBySlug,
  getCategoryById,
  calculateTrackProgress,
  moduleImages,
} from "@/lib/learning-tracks-data";
import { RoleplayCallModal } from "@/components/learning-tracks";
import { LearningModule, ModuleStatus } from "@/types";
import { cn } from "@/lib/utils";

interface TrackPageProps {
  params: Promise<{ slug: string }>;
}

const statusConfig: Record<ModuleStatus, { label: string; color: "default" | "primary" | "success" }> = {
  not_started: { label: "Não iniciado", color: "default" },
  in_progress: { label: "Em progresso", color: "primary" },
  completed: { label: "Concluído", color: "success" },
};

// Module thumbnail images based on index
const getModuleImage = (index: number): string => {
  const images = Object.values(moduleImages);
  return images[index % images.length];
};

export default function TrackDetailPage({ params }: TrackPageProps) {
  const router = useRouter();
  const { slug } = use(params);
  const track = getTrackBySlug(slug);
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set(["mod-0"]));
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [callModule, setCallModule] = useState<LearningModule | null>(null);

  if (!track) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="heading-2 mb-4">Trilha não encontrada</h1>
        <p className="text-[#6B7280] mb-6">A trilha que você procura não existe ou foi removida.</p>
        <Link href="/trilhas">
          <Button variant="bordered" className="font-semibold">
            Voltar para Trilhas
          </Button>
        </Link>
      </div>
    );
  }

  const category = getCategoryById(track.categoryId);
  const displayModules = track.modules.slice(0, 3);
  const progress = displayModules.length
    ? Math.round(
        (displayModules.filter((m) => m.status === "completed").length / displayModules.length) * 100
      )
    : 0;
  const completedModules = displayModules.filter((m) => m.status === "completed").length;

  const handleStartModule = (module: LearningModule) => {
    addToast({
      title: "Módulo iniciado!",
      description: `Iniciando "${module.title}"`,
      color: "success",
    });

    if (module.scenarioSlug && module.characterId) {
      router.push(
        `/roleplays/scenario/${module.scenarioSlug}?character=${module.characterId}&trackId=${track.id}`
      );
    }
  };

  return (
    <div className="animate-fade-in pb-6 sm:pb-8">
      {/* Back button */}
      <div className="mb-4 sm:mb-6">
        <Link
          href="/trilhas"
          className="inline-flex items-center gap-2 text-sm sm:text-base text-[#6B7280] hover:text-[#111827] transition-colors font-medium min-h-[44px]"
        >
          <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          Voltar para Trilhas
        </Link>
      </div>

      {/* Hero Banner */}
      <div className="relative w-full h-[240px] sm:h-[280px] md:h-[360px] rounded-2xl overflow-hidden mb-6 sm:mb-8">
        {/* Image */}
        <Image
          src={track.coverImage}
          alt={track.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 1200px"
          priority
        />

        {/* Inner shadow for depth */}
        <div className="absolute inset-0 shadow-[inset_0_-120px_100px_-60px_rgba(0,0,0,0.85)]" />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 z-10">
          {/* Category badge */}
          {category && (
            <div className="mb-3 sm:mb-4">
              <span className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/25 backdrop-blur-md text-white font-semibold text-xs sm:text-sm border border-white/30 shadow-lg">
                {category.name}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3 drop-shadow-lg leading-tight">
            {track.title}
          </h1>

          {/* Description */}
          <p className="text-white/90 text-sm sm:text-base md:text-lg max-w-3xl mb-4 sm:mb-5 drop-shadow-md line-clamp-2 sm:line-clamp-none">
            {track.description}
          </p>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-5 text-white text-xs sm:text-sm font-medium">
            <div className="flex items-center gap-2">
              <ClockIcon className="w-5 h-5" />
              <span>{track.estimatedTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <AcademicCapIcon className="w-5 h-5" />
              <span>{displayModules.length} módulos</span>
            </div>
            {progress > 0 && (
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5" />
                <span>{completedModules}/{displayModules.length} completos</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Modules list - Main column */}
        <div className="lg:col-span-2">
          {/* Progress card */}
          {progress > 0 && (
            <div className="mb-4 sm:mb-6 p-4 sm:p-5 bg-white rounded-2xl border border-[#E5E7EB]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base sm:text-lg font-bold text-[#111827]">Seu Progresso</h3>
                <span className="text-base sm:text-lg font-bold text-[#2E63CD]">{progress}%</span>
              </div>
              <Progress
                value={progress}
                color="primary"
                size="lg"
                className="h-3"
                aria-label={`Progresso da trilha: ${progress}%`}
              />
              <p className="text-sm text-[#6B7280] mt-2">
                {completedModules} de {displayModules.length} módulos concluídos
              </p>
            </div>
          )}

          {/* Modules accordion */}
          <Accordion
            selectionMode="multiple"
            selectedKeys={expandedKeys}
            onSelectionChange={(keys) => setExpandedKeys(keys as Set<string>)}
            className="gap-2 [&>div]:!px-0"
            itemClasses={{
              base: "bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden px-0",
              heading: "px-0",
              trigger: "px-5 py-4 hover:bg-[#F9FAFB] data-[hover=true]:bg-[#F9FAFB] transition-colors data-[selected=true]:border-0 data-[open=true]:border-0 data-[selected=true]:!border-0 data-[open=true]:!border-0",
              title: "font-semibold text-[#111827]",
              content: "px-5 pb-5 pt-0",
              indicator: "text-[#6B7280]",
            }}
          >
            {displayModules.map((module, index) => {
              const isCompleted = module.status === "completed";
              const isInProgress = module.status === "in_progress";
              const isRoleplayModule = index === 2 && module.scenarioSlug && module.characterId;
              const status = statusConfig[module.status];

              const getChipBgColor = () => {
                if (isCompleted) return "bg-[#ECFDF5] text-[#059669]";
                if (isInProgress) return "bg-[#EBF0FA] text-[#2E63CD]";
                return "bg-[#F3F4F6] text-[#6B7280]";
              };

              return (
                <AccordionItem
                  key={`mod-${index}`}
                  aria-label={module.title}
                  startContent={
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                        isCompleted
                          ? "bg-[#10B981] text-white"
                          : isInProgress
                          ? "bg-[#2E63CD] text-white"
                          : "bg-[#F3F4F6] text-[#6B7280] border-2 border-[#E5E7EB]"
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircleSolid className="w-5 h-5" />
                      ) : (
                        <span className="font-bold text-sm">{index + 1}</span>
                      )}
                    </div>
                  }
                  title={
                    <div className="flex items-center gap-3">
                      <span className={isCompleted ? "text-[#059669]" : ""}>{module.title}</span>
                      <Chip size="sm" variant="flat" className={cn("text-xs px-2.5 sm:px-3 py-1 sm:py-1.5", getChipBgColor())}>
                        {status.label}
                      </Chip>
                    </div>
                  }
                  subtitle={
                    <span className="text-[#6B7280] text-sm">{module.duration}</span>
                  }
                >
                  <div className="space-y-3 sm:space-y-4">
                    <div className="relative w-full h-40 sm:h-48 rounded-xl overflow-hidden bg-[#F3F4F6]">
                      <Image
                        src={getModuleImage(index)}
                        alt={module.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 600px"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                          <PlayIcon className="w-7 h-7 text-[#2E63CD] ml-1" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm sm:text-base font-semibold text-[#111827] mb-1 sm:mb-2">Objetivo</h4>
                      <p className="text-xs sm:text-sm text-[#4B5563]">{module.objective}</p>
                    </div>

                    {module.content && (
                      <div>
                        <h4 className="text-sm sm:text-base font-semibold text-[#111827] mb-1 sm:mb-2">Conteúdo do módulo</h4>
                        <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">{module.content}</p>
                      </div>
                    )}

                    {isRoleplayModule ? (
                      <Button
                        className="w-full min-h-[48px] font-semibold btn-cta"
                        onPress={() => {
                          setCallModule(module);
                          setIsCallModalOpen(true);
                        }}
                        startContent={<PlayIcon className="w-5 h-5" />}
                      >
                        Fazer chamada
                      </Button>
                    ) : (
                      <Button
                        className={cn(
                          "w-full min-h-[48px] font-semibold",
                          isCompleted
                            ? "bg-[#ECFDF5] text-[#059669] hover:bg-[#D1FAE5]"
                            : "btn-cta"
                        )}
                        onPress={() => handleStartModule(module)}
                        startContent={
                          isCompleted ? (
                            <PlayCircleIcon className="w-5 h-5" />
                          ) : (
                            <PlayIcon className="w-5 h-5" />
                          )
                        }
                      >
                        {isCompleted ? "Revisar Módulo" : isInProgress ? "Continuar" : "Iniciar Módulo"}
                      </Button>
                    )}
                  </div>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Action card */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-6 sticky top-4 sm:top-6">
            <h3 className="text-base sm:text-lg font-bold text-[#111827] mb-3 sm:mb-4">Ações Rápidas</h3>

            <div className="space-y-3">
              <Button
                className="w-full btn-cta min-h-[52px]"
                onPress={() => {
                  const nextModule = displayModules.find(
                    (m) => m.status !== "completed"
                  ) || displayModules[0];
                  if (nextModule) handleStartModule(nextModule);
                }}
              >
                {progress > 0 ? "Continuar Trilha" : "Iniciar Trilha"}
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-[#E5E7EB] space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-[#6B7280]">Duração total</span>
                <span className="text-sm sm:text-base font-semibold text-[#111827]">{track.estimatedTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-[#6B7280]">Módulos</span>
                <span className="text-sm sm:text-base font-semibold text-[#111827]">{displayModules.length}</span>
              </div>
            </div>

            {/* Tags */}
            {track.tags.length > 0 && (
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-[#E5E7EB]">
                <h4 className="text-sm sm:text-base font-semibold text-[#111827] mb-2 sm:mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {track.tags.map((tag) => (
                    <Chip
                      key={tag}
                      size="sm"
                      variant="flat"
                      className="bg-[#F3F4F6] text-[#4B5563] px-2.5 sm:px-3 py-1 sm:py-1.5"
                    >
                      {tag}
                    </Chip>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <RoleplayCallModal
        track={track}
        module={callModule}
        isOpen={isCallModalOpen}
        onClose={() => {
          setIsCallModalOpen(false);
          setCallModule(null);
        }}
      />
    </div>
  );
}
