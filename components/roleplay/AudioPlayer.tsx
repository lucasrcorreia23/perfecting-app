"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardBody, Button, Progress, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import {
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/24/solid";
import { formatDuration } from "@/lib/utils";

interface AudioPlayerProps {
  audioUrl: string;
  duration: number;
}

export function AudioPlayer({ audioUrl, duration }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mock: Simular progresso do áudio
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + playbackSpeed;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, duration, playbackSpeed]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number | number[]) => {
    const newTime = Array.isArray(value) ? value[0] : value;
    setCurrentTime(newTime);
  };

  const handleVolumeToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
  };

  const progressPercentage = (currentTime / duration) * 100;

  const speedOptions = [
    { key: "0.5", label: "0.5x", value: 0.5 },
    { key: "0.75", label: "0.75x", value: 0.75 },
    { key: "1", label: "1x", value: 1 },
    { key: "1.25", label: "1.25x", value: 1.25 },
    { key: "1.5", label: "1.5x", value: 1.5 },
    { key: "2", label: "2x", value: 2 },
  ];

  return (
    <Card className="bg-white border border-[#E5E7EB] rounded-2xl gradient-neutral">
      <CardBody className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#111827]">
            Gravação da Chamada
          </h3>
          <span className="text-sm text-[#6B7280]">
            {formatDuration(Math.floor(currentTime))} / {formatDuration(duration)}
          </span>
        </div>

        {/* Progress Bar with Gradient */}
        <div className="space-y-2">
          <div 
            className="relative h-2 bg-[#E5E7EB] rounded-full overflow-hidden cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const percentage = x / rect.width;
              setCurrentTime(percentage * duration);
            }}
          >
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#2E63CD] to-[#4A7FE8] rounded-full transition-all duration-200"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Play/Pause Button */}
            <Button
              isIconOnly
              size="lg"
              className="bg-[#2E63CD] hover:bg-[#2451A8] text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
              onPress={handlePlayPause}
              aria-label={isPlaying ? "Pausar" : "Reproduzir"}
            >
              {isPlaying ? (
                <PauseIcon className="w-6 h-6" />
              ) : (
                <PlayIcon className="w-6 h-6" />
              )}
            </Button>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                className="text-[#6B7280] rounded-lg hover:bg-[#F9FAFB] transition-colors"
                onPress={handleVolumeToggle}
                aria-label={isMuted ? "Ativar som" : "Silenciar"}
              >
                {isMuted ? (
                  <SpeakerXMarkIcon className="w-5 h-5" />
                ) : (
                  <SpeakerWaveIcon className="w-5 h-5" />
                )}
              </Button>
              <div className="w-20">
                <Progress
                  value={isMuted ? 0 : volume}
                  maxValue={100}
                  size="sm"
                  aria-label="Volume"
                  className="cursor-pointer"
                  classNames={{
                    indicator: "bg-[#2E63CD]",
                    track: "bg-[#E5E7EB]",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Playback Speed */}
          <Dropdown
            classNames={{ content: "p-1 outline-none ring-0 rounded-xl shadow-lg border border-[#E5E7EB] bg-white min-w-[100px]" }}
          >
            <DropdownTrigger>
              <Button
                size="sm"
                variant="bordered"
                className="border-2 border-[#E5E7EB] hover:border-[#2E63CD] rounded-lg min-w-[70px]"
              >
                {playbackSpeed}x
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Velocidade de reprodução"
              selectedKeys={new Set([playbackSpeed.toString()])}
              selectionMode="single"
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                const speed = speedOptions.find((s) => s.key === selected)?.value || 1;
                handleSpeedChange(speed);
              }}
              variant="flat"
              color="default"
              classNames={{ base: "p-1", list: "gap-0.5" }}
              itemClasses={{
                base: "rounded-lg data-[hover=true]:bg-[#F9FAFB] data-[pressed=true]:opacity-80 data-[focus-visible=true]:outline-none data-[focus-visible=true]:ring-2 data-[focus-visible=true]:ring-[#E5E7EB] data-[focus-visible=true]:ring-inset data-[focus-visible=true]:ring-offset-0",
              }}
            >
              {speedOptions.map((option) => (
                <DropdownItem key={option.key} className="rounded-lg">
                  {option.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>

        {/* Mock Note */}
        <p className="text-xs text-[#9CA3AF] italic text-center pt-2">
          * Player mockado para demonstração
        </p>
      </CardBody>
    </Card>
  );
}
