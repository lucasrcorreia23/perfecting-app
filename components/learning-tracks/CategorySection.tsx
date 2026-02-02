"use client";

import { useRef, useState, useEffect } from "react";
import { TrackCategory, LearningTrack } from "@/types";
import { TrackCard } from "./TrackCard";
import { cn } from "@/lib/utils";

interface CategorySectionProps {
  category: TrackCategory;
  tracks: LearningTrack[];
  onTrackSelect: (track: LearningTrack) => void;
  showProgress?: boolean;
}

export function CategorySection({
  category,
  tracks,
  onTrackSelect,
  showProgress = false,
}: CategorySectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const dragDistanceRef = useRef(0);
  const velocityRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  const checkScrollability = () => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const hasMoreContent = scrollWidth > clientWidth;
    const threshold = 5; // Small threshold to account for rounding
    
    setCanScrollLeft(hasMoreContent && scrollLeft > threshold);
    setCanScrollRight(hasMoreContent && scrollLeft < scrollWidth - clientWidth - threshold);
  };

  useEffect(() => {
    // Initial check
    const timer = setTimeout(checkScrollability, 100);
    
    // Check on resize
    const handleResize = () => {
      setTimeout(checkScrollability, 100);
    };
    
    // Check when images load (cards might resize)
    const handleLoad = () => {
      setTimeout(checkScrollability, 100);
    };
    
    window.addEventListener("resize", handleResize);
    window.addEventListener("load", handleLoad);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("load", handleLoad);
    };
  }, [tracks]);


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
    
    setIsDragging(false);
    
    // Read current scroll position directly from DOM (not from state)
    // This ensures we have the actual current position, not a stale value
    const currentScroll = scrollRef.current.scrollLeft;
    
    // Apply momentum scrolling for smooth deceleration
    // Always apply momentum if there was any drag, even small, to avoid instant stop
    if (dragDistanceRef.current > 2) {
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
          } else {
            // Ensure we snap to a reasonable position after momentum
            checkScrollability();
          }
        }
      };
      
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      checkScrollability();
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
    checkScrollability();
    dragDistanceRef.current = 0;
    velocityRef.current = 0;
  };

  if (tracks.length === 0) return null;

  return (
    <section className="relative">
      {/* Header */}
      <div className="mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#111827]">{category.name}</h2>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-1">{category.description}</p>
      </div>

      {/* Scroll container wrapper */}
      <div className="relative">
        {/* Shadow indicator when there's more content to scroll */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-4 w-20 bg-gradient-to-l from-black/8 via-black/4 to-transparent z-10 pointer-events-none" />
        )}

        {/* Track cards container */}
        <div
          ref={scrollRef}
          onScroll={checkScrollability}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x",
            isDragging ? "cursor-grabbing select-none" : "cursor-grab"
          )}
          style={{ scrollSnapType: isDragging ? "none" : "x proximity" }}
        >
          {tracks.map((track) => (
            <div
              key={track.id}
              className="flex-shrink-0 snap-start"
              style={{ scrollSnapAlign: "start" }}
            >
              <TrackCard
                track={track}
                variant="compact"
                onSelect={onTrackSelect}
                showProgress={showProgress}
                isDragging={isDragging}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
