"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { AppStore } from "@/store/useAppStore";
import { formatKoreanDate, toDateKey } from "@/lib/date";
import { getTodayOverview } from "@/lib/selectors";
import { Button } from "@/components/ui/Button";
import { Card, SectionTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input, Textarea } from "@/components/ui/Field";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";

export function TodayView({ store }: { store: AppStore }) {
  const data = store.data!;
  const today = toDateKey();
  const tasks = data.tasks.filter((task) => task.date === today);
  const blocks = data.timeBlocks.filter((block) => block.date === today).sort((a, b) => a.start.localeCompare(b.start));
  const overview = getTodayOverview(data, today);
  const [taskTitle, setTaskTitle] = useState("");
  const [blockTitle, setBlockTitle] = useState("");
  const [blockStart, setBlockStart] = useState("09:00");
  const [blockEnd, setBlockEnd] = useState("10:00");
  const done = tasks.filter((task) => task.status === "done").length;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={formatKoreanDate(today)}
        title="오늘 실행"
        description="오늘의 포커스를 작업과 시간으로 나누고, 실행 후 빠르게 로그를 남깁니다."
        action={<div className="rounded-md border border-line bg-panel px-4 py-3 text-sm text-muted">완료 {done} / {tasks.length}</div>}
      />

      <Card>
        <SectionTitle title="오늘 포커스 문장" />
        <Input value={data.todayFocus} onChange={(event) => store.setTodayFocus(event.target.value)} />
      </Card>

      <Card>
        <SectionTitle title="오늘 운영 리듬" caption="작업 완료율과 시간 배치 상태를 함께 확인합니다." />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-md border border-line bg-[#fdfcf8] p-4 md:col-span-2">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="font-medium text-ink">체크리스트 완료율</span>
              <span className="text-muted">{overview.completionRate}%</span>
            </div>
            <ProgressBar value={overview.completionRate} />
          </div>
          <div className="rounded-md border border-line bg-[#fdfcf8] p-4 text-sm text-muted">
            <div className="font-medium text-ink">시간 배치</div>
            <p className="mt-2">오늘 타임블록 {overview.blocks.length}개</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <SectionTitle title="데일리 체크리스트" />
          <div className="mb-4 flex gap-2">
            <Input placeholder="작업 추가" value={taskTitle} onChange={(event) => setTaskTitle(event.target.value)} />
            <Button
              variant="primary"
              onClick={() => {
                if (!taskTitle.trim()) return;
                store.addTask({ title: taskTitle.trim(), note: "", date: today });
                setTaskTitle("");
              }}
            >
              <Plus size={16} />
            </Button>
          </div>
          <div className="space-y-2">
            {tasks.length ? tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 rounded-md border border-line p-3">
                <input
                  type="checkbox"
                  checked={task.status === "done"}
                  onChange={() => store.updateTask(task.id, { status: task.status === "done" ? "todo" : "done" })}
                />
                <button className="flex-1 text-left" onClick={() => store.setInspectorItem({ kind: "task", id: task.id })}>
                  <span className={task.status === "done" ? "text-muted line-through" : "text-ink"}>{task.title}</span>
                </button>
                <Button className="h-8 w-8 px-0" variant="ghost" onClick={() => store.deleteTask(task.id)}>
                  <Trash2 size={15} />
                </Button>
              </div>
            )) : <EmptyState title="오늘 할 일이 없습니다" description="작은 작업 하나를 추가해서 실행 루프를 시작하세요." />}
          </div>
        </Card>

        <Card>
          <SectionTitle title="타임블록" caption="시간을 먼저 배치하고 실행을 닫습니다." />
          <div className="mb-4 grid gap-2 sm:grid-cols-[1fr_88px_88px_auto]">
            <Input placeholder="블록 제목" value={blockTitle} onChange={(event) => setBlockTitle(event.target.value)} />
            <Input type="time" value={blockStart} onChange={(event) => setBlockStart(event.target.value)} />
            <Input type="time" value={blockEnd} onChange={(event) => setBlockEnd(event.target.value)} />
            <Button
              variant="primary"
              onClick={() => {
                if (!blockTitle.trim()) return;
                store.addTimeBlock({ title: blockTitle.trim(), start: blockStart, end: blockEnd, date: today });
                setBlockTitle("");
              }}
            >
              추가
            </Button>
          </div>
          <div className="space-y-2">
            {blocks.length ? blocks.map((block) => (
              <button
                key={block.id}
                className="grid w-full grid-cols-[88px_1fr_auto] items-center gap-3 rounded-md border border-line p-3 text-left hover:border-sage"
                onClick={() => store.setInspectorItem({ kind: "timeBlock", id: block.id })}
              >
                <span className="text-sm text-muted">{block.start}</span>
                <span className="font-medium text-ink">{block.title}</span>
                <span className="text-sm text-muted">{block.end}</span>
              </button>
            )) : <EmptyState title="오늘의 타임블록이 없습니다" description="실행할 시간을 먼저 확보하면 체크리스트가 더 잘 닫힙니다." />}
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle title="빠른 메모" />
        <Textarea value={data.quickMemo} onChange={(event) => store.setQuickMemo(event.target.value)} />
      </Card>
    </div>
  );
}
