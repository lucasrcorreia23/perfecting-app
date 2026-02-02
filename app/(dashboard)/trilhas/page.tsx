"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/react";
import {
  HeroCarousel,
  CategorySection,
  TrackDetailsModal,
} from "@/components/learning-tracks";
import {
  learningCategories,
  learningTracks,
  getFeaturedTracks,
  getTracksByCategory,
} from "@/lib/learning-tracks-data";
import { LearningTrack, LearningModule, TrackCategory } from "@/types";

export default function TrilhasPage() {
  const router = useRouter();
  const [selectedTrack, setSelectedTrack] = useState<LearningTrack | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const featuredTracks = getFeaturedTracks();

  const handleTrackSelect = (track: LearningTrack) => {
    setSelectedTrack(track);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTrack(null);
  };

  const handleStartTrack = (track: LearningTrack) => {
    addToast({
      title: "Trilha iniciada!",
      description: `Você iniciou a trilha "${track.title}". Bons estudos!`,
      color: "success",
    });

    // Open modal with track details
    handleTrackSelect(track);
  };

  const handleStartModule = (track: LearningTrack, module: LearningModule) => {
    addToast({
      title: "Módulo iniciado!",
      description: `Iniciando "${module.title}"`,
      color: "success",
    });

    // Navigate to roleplay if module has scenario
    if (module.scenarioSlug && module.characterId) {
      router.push(
        `/roleplays/scenario/${module.scenarioSlug}?character=${module.characterId}&trackId=${track.id}`
      );
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 md:space-y-10 animate-fade-in pb-6 sm:pb-8">
      {/* Page header */}
   

      {/* Hero carousel with featured tracks */}
      <HeroCarousel
        tracks={featuredTracks}
        onTrackSelect={handleTrackSelect}
        onStartTrack={handleStartTrack}
        autoPlay={true}
        autoPlayInterval={6000}
      />

      {/* Category sections */}
      <div className="space-y-8 sm:space-y-10">
        {learningCategories.map((category) => {
          const categoryTracks = getTracksByCategory(category.id);
          if (categoryTracks.length === 0) return null;

          return (
            <div key={category.id} id={`category-${category.slug}`}>
              <CategorySection
                category={category}
                tracks={categoryTracks}
                onTrackSelect={handleTrackSelect}
                showProgress={true}
              />
            </div>
          );
        })}
      </div>

      {/* Track details modal */}
      <TrackDetailsModal
        track={selectedTrack}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onStartModule={handleStartModule}
      />
    </div>
  );
}
