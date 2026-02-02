"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { ClockIcon, AcademicCapIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { LearningTrack } from "@/types";
import { cn } from "@/lib/utils";

interface HeroCarouselProps {
  tracks: LearningTrack[];
  onTrackSelect: (track: LearningTrack) => void;
  onStartTrack: (track: LearningTrack) => void;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function HeroCarousel({
  tracks,
  onTrackSelect,
  onStartTrack,
  autoPlay = true,
  autoPlayInterval = 5000,
}: HeroCarouselProps) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const dragDistanceRef = useRef(0);
  const velocityRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  const scrollToIndex = useCallback((index: number) => {
    if (scrollRef.current) {
      const containerWidth = scrollRef.current.offsetWidth;
      const gap = 16; // 1rem gap between slides
      // Each slide is 100% width + gap, so total scroll distance is (width + gap) * index
      scrollRef.current.scrollTo({
        left: (containerWidth + gap) * index,
        behavior: "smooth",
      });
    }
  }, []);

  const handleNext = useCallback(() => {
    const newIndex = currentIndex === tracks.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
  }, [currentIndex, tracks.length, scrollToIndex]);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const containerWidth = scrollRef.current.offsetWidth;
      const gap = 16; // 1rem gap between slides
      const slideWidth = containerWidth + gap;
      const scrollLeft = scrollRef.current.scrollLeft;
      const newIndex = Math.round(scrollLeft / slideWidth);
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < tracks.length) {
        setCurrentIndex(newIndex);
      }
    }
  }, [currentIndex, tracks.length]);

  useEffect(() => {
    if (!autoPlay || isPaused || tracks.length <= 1) return;

    const interval = setInterval(() => {
      handleNext();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, isPaused, autoPlayInterval, handleNext, tracks.length]);

  // Drag handlers with smooth momentum
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    const rect = scrollRef.current.getBoundingClientRect();
    setStartX(e.pageX - rect.left);
    setScrollLeft(scrollRef.current.scrollLeft);
    dragDistanceRef.current = 0;
    velocityRef.current = 0;
    lastXRef.current = e.pageX;
    lastTimeRef.current = Date.now();
    setIsPaused(true); // Pause autoplay while dragging
    
    // Cancel any ongoing animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    
    const rect = scrollRef.current.getBoundingClientRect();
    const currentX = e.pageX - rect.left;
    const currentTime = Date.now();
    const deltaTime = currentTime - lastTimeRef.current;
    
    // Calculate velocity for momentum
    if (deltaTime > 0) {
      const deltaX = e.pageX - lastXRef.current;
      velocityRef.current = deltaX / deltaTime; // pixels per millisecond
    }
    
    // Smooth scroll with very gentle multiplier for smooth dragging
    const walk = (currentX - startX) * 0.8;
    dragDistanceRef.current = Math.abs(walk);
    
    // Use requestAnimationFrame for smoother updates
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    animationFrameRef.current = requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft = scrollLeft - walk;
      }
    });
    
    lastXRef.current = e.pageX;
    lastTimeRef.current = currentTime;
  };

  const handleMouseUp = () => {
    if (!scrollRef.current) return;
    
    // Cancel any pending animation frame to ensure we have the latest scroll position
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    const wasDragging = dragDistanceRef.current > 5;
    setIsDragging(false);
    setIsPaused(false);
    
    // Read current scroll position directly from DOM (not from state)
    // This ensures we have the actual current position, not a stale value
    const currentScroll = scrollRef.current.scrollLeft;
    
    // Apply momentum scrolling for smooth deceleration
    // Always apply momentum if there was any drag, even small, to avoid instant stop
    if (wasDragging && dragDistanceRef.current > 2) {
      // Calculate momentum with better multiplier for desktop smoothness
      const momentumMultiplier = Math.abs(velocityRef.current) > 0.1 ? 200 : 100;
      const momentum = velocityRef.current * momentumMultiplier;
      
      const targetScroll = currentScroll - momentum;
      const startScroll = currentScroll; // Use the actual current scroll position
      const startTime = Date.now();
      
      // Longer duration for smoother animation, especially on desktop
      const baseDuration = 600;
      const velocityFactor = Math.min(Math.abs(velocityRef.current) * 1000, 1);
      const duration = baseDuration + (velocityFactor * 200); // 600-800ms
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Improved ease-out for smoother deceleration
        const easeOut = 1 - Math.pow(1 - progress, 2.5);
        
        if (scrollRef.current) {
          scrollRef.current.scrollLeft = startScroll + (targetScroll - startScroll) * easeOut;
          
          if (progress < 1) {
            animationFrameRef.current = requestAnimationFrame(animate);
          }
        }
      };
      
      animationFrameRef.current = requestAnimationFrame(animate);
    }
    
    // Reset after a short delay
    setTimeout(() => {
      dragDistanceRef.current = 0;
      velocityRef.current = 0;
    }, 100);
  };

  const handleMouseLeave = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsDragging(false);
    setIsPaused(false);
    dragDistanceRef.current = 0;
    velocityRef.current = 0;
  };


  if (tracks.length === 0) return null;

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Carrossel de trilhas em destaque"
    >
      {/* Carousel container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 -mx-4 px-4",
          isDragging && "cursor-grabbing select-none"
        )}
        style={{ scrollSnapType: isDragging ? "none" : "x mandatory" }}
      >
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className="flex-shrink-0 w-full snap-start px-2"
            style={{ scrollSnapAlign: "start" }}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} de ${tracks.length}: ${track.title}`}
          >
            {/* Slide */}
            <div
            className={cn(
              "relative w-full h-[280px] sm:h-[320px] md:h-[400px] rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-shadow duration-300",
              isDragging ? "cursor-grabbing" : "cursor-grab"
            )}
              onClick={(e) => {
                // Prevent click if user was dragging
                if (dragDistanceRef.current < 5) {
                  onTrackSelect(track);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Ver detalhes de ${track.title}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onTrackSelect(track);
                }
              }}
            >
              {/* Image */}
              <Image
                src={track.coverImage}
                alt={track.title}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 1200px"
                priority={index === 0}
              />

              {/* Dark overlay for better contrast */}
              <div className="absolute inset-0 bg-black/30" />

              {/* Inner shadow for depth */}
              <div className="absolute inset-0 shadow-[inset_0_-200px_120px_-80px_rgba(0,0,0,0.95)]" />

              {/* Enhanced gradient overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 via-black/30 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 z-10">
                {/* Title */}
                <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-white mb-2 sm:mb-3 drop-shadow-2xl leading-tight">
                  {track.title}
                </h2>

                {/* Description */}
                <p className="text-white text-xs sm:text-sm md:text-base max-w-2xl mb-4 sm:mb-6 line-clamp-2 drop-shadow-lg font-medium">
                  {track.description}
                </p>

                {/* Buttons and Meta info - Same line */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4" onClick={(e) => e.stopPropagation()}>
                  {/* Buttons - Left aligned (Primary first) */}
                  <div className="flex flex-row gap-2 sm:gap-3">
                    <Button
                      className="btn-cta px-8"
                      onPress={() => router.push(`/trilhas/${track.slug}`)}
                      aria-label={`Iniciar trilha ${track.title}`}
                    >
                      Iniciar
                    </Button>
                  </div>

                  {/* Meta info - Right aligned */}
                  <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-white text-xs sm:text-sm font-semibold drop-shadow-md">
                    <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                      <ClockIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{track.estimatedTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                      <AcademicCapIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{track.modules.length} módulos</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination dots */}
      {tracks.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4" role="tablist" aria-label="Navegação do carrossel">
          {tracks.map((track, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                scrollToIndex(index);
              }}
              className={cn(
                "h-2.5 rounded-full transition-all duration-300",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5D4ED] focus-visible:ring-offset-2",
                index === currentIndex
                  ? "w-10 bg-[#111827]"
                  : "w-2.5 bg-[#D1D5DB] hover:bg-[#9CA3AF]"
              )}
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Ir para ${track.title}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
