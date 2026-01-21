"use client";

import { useParams, useRouter } from "next/navigation";
import { Button, Chip } from "@heroui/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { FeedbackPanel } from "@/components/roleplay";
import { mockRoleplays, mockFeedback, mockTranscript } from "@/lib/mock-data";
import { getCategoryColor, getCategoryLabel } from "@/lib/utils";

export default function FeedbackPage() {
  const params = useParams();
  const router = useRouter();
  const roleplayId = params.id as string;

  const roleplay = mockRoleplays.find((r) => r.id === roleplayId);

  if (!roleplay) {
    router.push("/roleplays");
    return null;
  }

  const handleRetry = () => {
    router.push(`/roleplays/${roleplayId}/practice`);
  };

  const handleNext = () => {
    // Find next roleplay or go to library
    const currentIndex = mockRoleplays.findIndex((r) => r.id === roleplayId);
    const nextRoleplay = mockRoleplays[currentIndex + 1];

    if (nextRoleplay) {
      router.push(`/roleplays/${nextRoleplay.id}/practice`);
    } else {
      router.push("/roleplays");
    }
  };

  const handleExport = () => {
    // In a real app, this would download the transcript
    const transcriptText = mockTranscript
      .map((entry) => `${entry.speaker === "user" ? "Você" : roleplay.agent.name}: ${entry.content}`)
      .join("\n\n");

    const blob = new Blob([transcriptText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transcricao-${roleplay.title.toLowerCase().replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const categoryColor = getCategoryColor(roleplay.category);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            isIconOnly
            variant="light"
            onPress={() => router.push("/roleplays")}
            className="text-[#6B7280]"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="heading-3">Feedback da Sessão</h1>
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
              {roleplay.title} • {roleplay.agent.name}
            </p>
          </div>
        </div>
      </div>

      {/* Feedback Panel */}
      <FeedbackPanel
        feedback={mockFeedback}
        transcript={mockTranscript}
        duration={480}
        onRetry={handleRetry}
        onNext={handleNext}
        onExport={handleExport}
      />
    </div>
  );
}
