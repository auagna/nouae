"use client";

import { Save } from "lucide-react";
import { useMemo, useState } from "react";
import type { AppStore } from "@/store/useAppStore";
import { toDateKey } from "@/lib/date";
import { Button } from "@/components/ui/Button";
import { Card, SectionTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Textarea } from "@/components/ui/Field";
import { PageHeader } from "@/components/ui/PageHeader";

export function ReviewView({ store }: { store: AppStore }) {
  const data = store.data!;
  const today = toDateKey();
  const tasks = data.tasks.filter((task) => task.date === today);
  const completed = tasks.filter((task) => task.status === "done");
  const missed = tasks.filter((task) => task.status !== "done");
  const existing = data.reviews.find((review) => review.date === today);
  const [completedSummary, setCompletedSummary] = useState(existing?.completedSummary ?? completed.map((task) => task.title).join("\n"));
  const [missedSummary, setMissedSummary] = useState(existing?.missedSummary ?? missed.map((task) => task.title).join("\n"));
  const [reflection, setReflection] = useState(existing?.reflection ?? "");
  const [refineNext, setRefineNext] = useState(existing?.refineNext ?? "");

  const weekly = useMemo(() => {
    const doneCount = data.tasks.filter((task) => task.status === "done").length;
    const moodAverage = data.moodLogs.length
      ? (data.moodLogs.reduce((sum, item) => sum + item.moodScore, 0) / data.moodLogs.length).toFixed(1)
      : "0";
    const energyAverage = data.moodLogs.length
      ? (data.moodLogs.reduce((sum, item) => sum + item.energyScore, 0) / data.moodLogs.length).toFixed(1)
      : "0";
    return { doneCount, moodAverage, energyAverage };
  }, [data.moodLogs, data.tasks]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Review / Refine"
        title="리뷰"
        description="완료와 미완료를 구분하고, 내일의 계획을 조금 더 현실적으로 조정합니다."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <Card>
          <SectionTitle title="완료 작업" />
          <div className="text-3xl font-semibold text-ink">{completed.length}</div>
          <p className="mt-2 text-sm text-muted">오늘 완료한 체크리스트</p>
        </Card>
        <Card>
          <SectionTitle title="놓친 작업" />
          <div className="text-3xl font-semibold text-ink">{missed.length}</div>
          <p className="mt-2 text-sm text-muted">내일 재배치할 항목</p>
        </Card>
        <Card>
          <SectionTitle title="주간 요약" />
          <p className="text-sm text-muted">완료 {weekly.doneCount}개 · 기분 {weekly.moodAverage}/5 · 에너지 {weekly.energyAverage}/5</p>
        </Card>
      </div>

      <Card>
        <SectionTitle title="일일 회고 작성" />
        <div className="grid gap-4 lg:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-ink">
            완료 요약
            <Textarea value={completedSummary} onChange={(event) => setCompletedSummary(event.target.value)} />
          </label>
          <label className="space-y-2 text-sm font-medium text-ink">
            놓친 것
            <Textarea value={missedSummary} onChange={(event) => setMissedSummary(event.target.value)} />
          </label>
          <label className="space-y-2 text-sm font-medium text-ink">
            회고 메모
            <Textarea value={reflection} onChange={(event) => setReflection(event.target.value)} />
          </label>
          <label className="space-y-2 text-sm font-medium text-ink">
            내일 다듬을 점
            <Textarea value={refineNext} onChange={(event) => setRefineNext(event.target.value)} />
          </label>
        </div>
        <Button
          className="mt-4"
          variant="primary"
          onClick={() => store.saveReview({ date: today, completedSummary, missedSummary, reflection, refineNext })}
        >
          <Save size={16} /> 저장
        </Button>
      </Card>

      <Card>
        <SectionTitle title="저장된 리뷰" />
        <div className="space-y-3">
          {data.reviews.length ? data.reviews.map((review) => (
            <div key={review.id} className="rounded-md border border-line p-4">
              <div className="font-semibold text-ink">{review.date}</div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-muted">{review.reflection || "회고 메모 없음"}</p>
            </div>
          )) : <EmptyState title="저장된 리뷰가 없습니다" description="오늘 회고를 저장하면 이곳에 쌓입니다." />}
        </div>
      </Card>
    </div>
  );
}
