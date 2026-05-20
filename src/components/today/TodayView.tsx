"use client";

import { ArrowRight, CheckCircle2, Clock, Play, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { AppStore } from "@/store/useAppStore";
import type { TaskStatus } from "@/types";
import { formatKoreanDate, toDateKey } from "@/lib/date";
import { taskStatusLabels } from "@/lib/labels";
import { getTodayOverview } from "@/lib/selectors";
import { Button } from "@/components/ui/Button";
import { Card, SectionTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input, Textarea } from "@/components/ui/Field";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";

const statusOrder: TaskStatus[] = ["todo", "doing", "done"];

export function TodayView({ store }: { store: AppStore }) {
  const data = store.data!;
  const today = toDateKey();
  const tasks = data.tasks.filter((task) => task.date === today);
  const blocks = data.timeBlocks.filter((block) => block.date === today).sort((a, b) => a.start.localeCompare(b.start));
  const overview = getTodayOverview(data, today);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskProjectId, setTaskProjectId] = useState("");
  const [blockTitle, setBlockTitle] = useState("");
  const [blockStart, setBlockStart] = useState("09:00");
  const [blockEnd, setBlockEnd] = useState("10:00");
  const done = tasks.filter((task) => task.status === "done").length;
  const doing = tasks.filter((task) => task.status === "doing").length;
  const missed = tasks.length - done;

  function addTodayTask() {
    if (!taskTitle.trim()) return;
    store.addTask({
      title: taskTitle.trim(),
      note: "",
      date: today,
      projectId: taskProjectId || undefined
    });
    setTaskTitle("");
  }

  function addTimeBlock() {
    if (!blockTitle.trim()) return;
    store.addTimeBlock({ title: blockTitle.trim(), start: blockStart, end: blockEnd, date: today });
    setBlockTitle("");
  }

  function startTask(taskId: string, title: string) {
    store.updateTask(taskId, { status: "doing" });
    store.addTimeBlock({
      title,
      start: blockStart,
      end: blockEnd,
      date: today,
      type: "task",
      note: "Today 작업에서 시작한 실행 블록"
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={formatKoreanDate(today)}
        title="오늘 실행"
        description="오늘의 포커스를 작업과 시간으로 나누고, 실행 후 바로 회고로 넘깁니다."
        action={<div className="rounded-md border border-line bg-panel px-4 py-3 text-sm text-muted">완료 {done} / {tasks.length}</div>}
      />

      <Card>
        <SectionTitle title="오늘 포커스 문장" caption="하루를 닫을 때 성공 여부를 판단할 기준입니다." />
        <Input value={data.todayFocus} onChange={(event) => store.setTodayFocus(event.target.value)} />
      </Card>

      <Card>
        <SectionTitle title="오늘 운영 리듬" caption="완료율, 진행 중 작업, 시간 배치를 함께 확인합니다." />
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-md border border-line bg-[#fdfcf8] p-4 md:col-span-2">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="font-medium text-ink">체크리스트 완료율</span>
              <span className="text-muted">{overview.completionRate}%</span>
            </div>
            <ProgressBar value={overview.completionRate} />
          </div>
          <RhythmStat icon={<Play size={15} />} label="진행 중" value={`${doing}개`} />
          <RhythmStat icon={<Clock size={15} />} label="타임블록" value={`${overview.blocks.length}개`} />
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <SectionTitle title="데일리 체크리스트" caption="작업을 추가하고 바로 상태를 바꾸거나 실행 블록으로 전환합니다." />
          <div className="mb-4 grid gap-2 lg:grid-cols-[1fr_180px_auto]">
            <Input placeholder="작업 추가" value={taskTitle} onChange={(event) => setTaskTitle(event.target.value)} />
            <select
              className="h-10 rounded-md border border-line bg-white px-3 text-sm text-ink outline-none focus:border-sage"
              value={taskProjectId}
              onChange={(event) => setTaskProjectId(event.target.value)}
            >
              <option value="">프로젝트 없음</option>
              {data.projects.map((project) => (
                <option key={project.id} value={project.id}>{project.title}</option>
              ))}
            </select>
            <Button variant="primary" onClick={addTodayTask}>
              <Plus size={16} /> 추가
            </Button>
          </div>
          <div className="space-y-3">
            {tasks.length ? (
              tasks.map((task) => (
                <div key={task.id} className="rounded-md border border-line p-3">
                  <div className="flex items-start gap-3">
                    <input
                      className="mt-1"
                      type="checkbox"
                      checked={task.status === "done"}
                      onChange={() => store.updateTask(task.id, { status: task.status === "done" ? "todo" : "done" })}
                    />
                    <button className="min-w-0 flex-1 text-left" onClick={() => store.setInspectorItem({ kind: "task", id: task.id })}>
                      <span className={task.status === "done" ? "block text-muted line-through" : "block text-ink"}>{task.title}</span>
                      {task.note ? <span className="mt-1 block text-sm text-muted">{task.note}</span> : null}
                    </button>
                    <Button className="h-8 w-8 px-0" variant="ghost" onClick={() => store.deleteTask(task.id)}>
                      <Trash2 size={15} />
                    </Button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 pl-7">
                    {statusOrder.map((status) => (
                      <Button
                        key={status}
                        className="h-8"
                        variant={task.status === status ? "primary" : "secondary"}
                        onClick={() => store.updateTask(task.id, { status })}
                      >
                        {taskStatusLabels[status]}
                      </Button>
                    ))}
                    <Button className="h-8" onClick={() => startTask(task.id, task.title)}>
                      <Clock size={14} /> 블록 시작
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState title="오늘 할 일이 없습니다" description="작은 작업 하나를 추가해서 실행 루프를 시작하세요." />
            )}
          </div>
        </Card>

        <Card>
          <SectionTitle title="타임블록" caption="시간을 먼저 확보하고 실행을 닫습니다." />
          <div className="mb-4 grid gap-2 sm:grid-cols-[1fr_88px_88px_auto]">
            <Input placeholder="블록 제목" value={blockTitle} onChange={(event) => setBlockTitle(event.target.value)} />
            <Input type="time" value={blockStart} onChange={(event) => setBlockStart(event.target.value)} />
            <Input type="time" value={blockEnd} onChange={(event) => setBlockEnd(event.target.value)} />
            <Button variant="primary" onClick={addTimeBlock}>추가</Button>
          </div>
          <div className="space-y-2">
            {blocks.length ? (
              blocks.map((block) => (
                <button
                  key={block.id}
                  className="grid w-full grid-cols-[88px_1fr_auto] items-center gap-3 rounded-md border border-line p-3 text-left hover:border-sage"
                  onClick={() => store.setInspectorItem({ kind: "timeBlock", id: block.id })}
                >
                  <span className="text-sm text-muted">{block.start}</span>
                  <span className="font-medium text-ink">{block.title}</span>
                  <span className="text-sm text-muted">{block.end}</span>
                </button>
              ))
            ) : (
              <EmptyState title="오늘의 타임블록이 없습니다" description="실행할 시간을 먼저 확보하면 체크리스트가 더 잘 닫힙니다." />
            )}
          </div>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <Card>
          <SectionTitle title="빠른 메모" caption="오늘 실행 중 떠오른 메모를 남깁니다." />
          <Textarea value={data.quickMemo} onChange={(event) => store.setQuickMemo(event.target.value)} />
        </Card>

        <Card>
          <SectionTitle title="회고로 넘기기" caption="오늘의 실행 결과를 Review에서 바로 정리합니다." />
          <div className="space-y-3 text-sm text-muted">
            <div className="flex items-center justify-between rounded-md border border-line bg-[#fdfcf8] p-3">
              <span className="flex items-center gap-2"><CheckCircle2 size={15} /> 완료</span>
              <span>{done}개</span>
            </div>
            <div className="flex items-center justify-between rounded-md border border-line bg-[#fdfcf8] p-3">
              <span>남은 작업</span>
              <span>{missed}개</span>
            </div>
          </div>
          <Button className="mt-4 w-full" variant="primary" onClick={() => store.navigate("review")}>
            회고 작성으로 이동 <ArrowRight size={15} />
          </Button>
        </Card>
      </div>
    </div>
  );
}

function RhythmStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-[#fdfcf8] p-4">
      <div className="flex items-center gap-2 text-sm text-muted">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-xl font-semibold text-ink">{value}</div>
    </div>
  );
}
