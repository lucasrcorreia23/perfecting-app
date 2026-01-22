"use client";

import { Card, CardBody, Progress, Chip } from "@heroui/react";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "@heroicons/react/24/outline";
import { cn, getScoreColor, formatDuration } from "@/lib/utils";
import type { SessionHistoryEntry } from "@/types";

interface SessionHistoryChartProps {
  sessions: SessionHistoryEntry[];
}

export function SessionHistoryChart({ sessions }: SessionHistoryChartProps) {
  // Ordenar sessões por data (mais recente primeiro)
  const sortedSessions = [...sessions].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  // Calcular tendência
  const calculateTrend = () => {
    if (sessions.length < 2) return null;

    const recent = sortedSessions.slice(0, Math.min(3, sessions.length));
    const older = sortedSessions.slice(-Math.min(3, sessions.length));

    const recentAvg = recent.reduce((sum, s) => sum + s.score, 0) / recent.length;
    const olderAvg = older.reduce((sum, s) => sum + s.score, 0) / older.length;

    const trend = recentAvg - olderAvg;

    return {
      value: trend,
      isPositive: trend > 0,
      percentage: Math.abs(Math.round((trend / olderAvg) * 100)),
    };
  };

  const trend = calculateTrend();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  };

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="bg-white border border-[#E5E7EB] rounded-2xl gradient-primary-soft">
        <CardBody className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#111827]">
              Evolução de Performance
            </h3>
            {trend && (
              <div className="flex items-center gap-2">
                {trend.isPositive ? (
                  <ArrowTrendingUpIcon className="w-5 h-5 text-[#10B981]" />
                ) : (
                  <ArrowTrendingDownIcon className="w-5 h-5 text-[#EF4444]" />
                )}
                <Chip
                  size="sm"
                  variant="flat"
                  color={trend.isPositive ? "success" : "danger"}
                  className="font-medium"
                >
                  {trend.isPositive ? "+" : ""}
                  {trend.percentage}%
                </Chip>
              </div>
            )}
          </div>

          <p className="text-sm text-[#6B7280]">
            Últimas {sessions.length} sessões - {trend?.isPositive ? "Tendência de melhoria" : "Atenção necessária"}
          </p>
        </CardBody>
      </Card>

      {/* Sessions List */}
      <div className="space-y-4">
        {sortedSessions.map((session, index) => {
          const scoreColorClass = getScoreColor(session.score);
          const isRecent = index === 0;

          return (
            <Card
              key={session.sessionId}
              className={cn(
                "bg-white border rounded-xl transition-all duration-200 hover:shadow-md",
                isRecent ? "border-[#3B82F6] border-2" : "border-[#E5E7EB]"
              )}
            >
              <CardBody className="p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-[#111827] truncate">
                        {session.roleplayTitle}
                      </h4>
                      {isRecent && (
                        <Chip
                          size="sm"
                          color="primary"
                          variant="flat"
                          className="font-medium text-xs"
                        >
                          Mais recente
                        </Chip>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#6B7280]">
                      <span>{formatDate(session.date)}</span>
                      <span>•</span>
                      <span>{formatDuration(session.duration)}</span>
                      <span>•</span>
                      <span className="capitalize">{session.category}</span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className={cn("text-2xl font-bold", scoreColorClass)}>
                      {session.score}
                    </div>
                    <span className="text-xs text-[#6B7280]">pontos</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <Progress
                  value={session.score}
                  maxValue={100}
                  size="sm"
                  radius="lg"
                  color={
                    session.score >= 80
                      ? "success"
                      : session.score >= 60
                      ? "warning"
                      : "danger"
                  }
                  classNames={{
                    track: "bg-[#F3F4F6]",
                  }}
                />

                {/* Trend Indicator (comparado com sessão anterior) */}
                {index < sortedSessions.length - 1 && (
                  <div className="mt-2 flex items-center gap-2">
                    {session.score > sortedSessions[index + 1].score ? (
                      <>
                        <ArrowTrendingUpIcon className="w-3 h-3 text-[#10B981]" />
                        <span className="text-xs text-[#10B981] font-medium">
                          +{session.score - sortedSessions[index + 1].score} vs sessão anterior
                        </span>
                      </>
                    ) : session.score < sortedSessions[index + 1].score ? (
                      <>
                        <ArrowTrendingDownIcon className="w-3 h-3 text-[#EF4444]" />
                        <span className="text-xs text-[#EF4444] font-medium">
                          {session.score - sortedSessions[index + 1].score} vs sessão anterior
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-[#6B7280]">
                        = vs sessão anterior
                      </span>
                    )}
                  </div>
                )}
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
