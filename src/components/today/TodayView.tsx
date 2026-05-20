"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { AppStore } from "@/store/useAppStore";
import { formatKoreanDate, toDateKey } from "@/lib/date";
import { Button } from "@/components/ui/Button";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Field";

export function TodayView({ store }: { store: AppStore }) {
  const data = store.data!;
  const today = toDateKey();
  const tasks = data.tasks.filter((task) => task.date === today);
  const blocks = data.timeBlocks.filter((block) => block.date === today).sort((a, b) => a.start.localeCompare(b.start));
  const [taskTitle, setTaskTitle] = useState("");
  const [blockTitle, setBlockTitle] = useState("");
  const done = tasks.filter((task) => task.status === "done").length;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-sage">{formatKoreanDate(today)}</p>
          <h1 className="mt-2 text-3xl font-semibold text-ink">오늘 실행</h1>
        </div>
        <div className="rounded-md border border-line bg-panel px-4 py-3 text-sm text-muted">
          완료 {done} / {tasks.length}
        </div>
      </header>

      <Card>
        <SectionTitle title="오늘 포커스 문장" />
        <Input value={data.todayFocus} onChange={(event) => store.setTodayFocus(event.target.value)} />
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
            {tasks.map((task) => (
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
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle title="타임블록" caption="시간을 먼저 배치하고 실행을 닫습니다." />
          <div className="mb-4 grid gap-2 sm:grid-cols-[1fr_88px_88px_auto]">
            <Input placeholder="블록 제목" value={blockTitle} onChange={(event) => setBlockTitle(event.target.value)} />
            <Input id="startTime" type="time" defaultValue="09:00" />
            <Input id="endTime" type="time" defaultValue="10:00" />
            <Button
              variant="primary"
              onClick={() => {
                const start = (document.getElementById("startTime") as HTMLInputElement | null)?.value ?? "09:00";
                const end = (document.getElementById("endTime") as HTMLInputElement | null)?.value ?? "10:00";
                if (!blockTitle.trim()) return;
                store.addTimeBlock({ title: blockTitle.trim(), start, end, date: today });
                setBlockTitle("");
              }}
            >
              추가
            </Button>
          </div>
          <div className="space-y-2">
            {blocks.map((block) => (
              <button
                key={block.id}
                className="grid w-full grid-cols-[88px_1fr_auto] items-center gap-3 rounded-md border border-line p-3 text-left hover:border-sage"
                onClick={() => store.setInspectorItem({ kind: "timeBlock", id: block.id })}
              >
                <span className="text-sm text-muted">{block.start}</span>
                <span className="font-medium text-ink">{block.title}</span>
                <span className="text-sm text-muted">{block.end}</span>
              </button>
            ))}
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
