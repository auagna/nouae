"use client";

import { Activity, Check, Clock, NotebookPen, Signal } from "lucide-react";
import type { AppStore } from "@/store/useAppStore";
import { toDateKey } from "@/lib/date";
import { Button } from "@/components/ui/Button";
import { Card, SectionTitle } from "@/components/ui/Card";

export function HomeView({ store }: { store: AppStore }) {
  const data = store.data!;
  const today = toDateKey();
  const todayTasks = data.tasks.filter((task) => task.date === today);
  const blocks = data.timeBlocks.filter((block) => block.date === today).sort((a, b) => a.start.localeCompare(b.start));
  const mood = data.moodLogs.find((log) => log.date === today);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-sage">Capture → Plan → Execute → Log → Review → Refine</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal text-ink">오늘의 운영 센터</h1>
        </div>
        <Button variant="primary" onClick={() => store.navigate("today")}>
          오늘 실행 열기
        </Button>
      </header>

      <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <SectionTitle title="오늘의 포커스" caption="오늘 하루의 기준 문장" />
          <div className="rounded-md border border-line bg-[#f7f5ef] p-4 text-xl font-semibold text-ink">{data.todayFocus}</div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <Metric icon={<Check size={17} />} label="오늘 작업" value={`${todayTasks.length}개`} />
            <Metric icon={<Clock size={17} />} label="타임블록" value={`${blocks.length}개`} />
            <Metric icon={<Signal size={17} />} label="에너지" value={mood ? `${mood.energyScore}/5` : "미기록"} />
          </div>
        </Card>

        <Card>
          <SectionTitle title="무드 / 에너지" caption="빠른 상태 기록" />
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5].map((score) => (
              <Button
                key={score}
                className="h-12"
                variant={mood?.moodScore === score ? "primary" : "secondary"}
                onClick={() => store.saveMoodLog(score as 1 | 2 | 3 | 4 | 5, (mood?.energyScore ?? 3) as 1 | 2 | 3 | 4 | 5, mood?.note ?? "")}
              >
                기분 {score}
              </Button>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionTitle title="현재 타임블록" />
          <div className="space-y-3">
            {blocks.map((block) => (
              <button
                key={block.id}
                className="flex w-full items-center justify-between rounded-md border border-line p-3 text-left hover:border-sage"
                onClick={() => store.setInspectorItem({ kind: "timeBlock", id: block.id })}
              >
                <span>
                  <span className="block font-medium text-ink">{block.title}</span>
                  <span className="text-sm text-muted">
                    {block.start} - {block.end}
                  </span>
                </span>
                <Activity size={17} className="text-sage" />
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle title="액티브 프로젝트" />
          <div className="space-y-2">
            {data.projects
              .filter((project) => project.status === "active")
              .slice(0, 5)
              .map((project) => (
                <button
                  key={project.id}
                  className="w-full rounded-md border border-line p-3 text-left hover:border-sage"
                  onClick={() => store.setInspectorItem({ kind: "project", id: project.id })}
                >
                  <div className="font-medium text-ink">{project.title}</div>
                  <div className="mt-1 line-clamp-2 text-sm text-muted">{project.description}</div>
                </button>
              ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <SectionTitle title="데일리 퀘스트" />
          <div className="space-y-2">
            {todayTasks.slice(0, 6).map((task) => (
              <label key={task.id} className="flex items-center gap-3 rounded-md border border-line p-3">
                <input
                  type="checkbox"
                  checked={task.status === "done"}
                  onChange={() => store.updateTask(task.id, { status: task.status === "done" ? "todo" : "done" })}
                />
                <span className={task.status === "done" ? "text-muted line-through" : "text-ink"}>{task.title}</span>
              </label>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle title="최근 노트" />
          <div className="space-y-3">
            {[...data.inboxItems.slice(0, 2), ...data.reviews.slice(0, 2)].map((item) => (
              <div key={item.id} className="rounded-md border border-line p-3">
                <div className="flex items-center gap-2 text-sm font-medium text-ink">
                  <NotebookPen size={15} />
                  {"title" in item ? item.title : item.date}
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{"note" in item ? item.note : item.reflection}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-white p-3">
      <div className="flex items-center gap-2 text-sm text-muted">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-xl font-semibold text-ink">{value}</div>
    </div>
  );
}
