"use client";

import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";
import type { AppStore } from "@/store/useAppStore";
import type { TimeBlockType } from "@/types";
import { addDays, addMonths, formatMonthTitle, getMonthGrid, getWeekDays, toDateKey } from "@/lib/date";
import { timeBlockTypeLabels } from "@/lib/labels";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Field";
import { PageHeader } from "@/components/ui/PageHeader";

const weekLabels = ["일", "월", "화", "수", "목", "금", "토"];

export function CalendarView({ store }: { store: AppStore }) {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("14:00");
  const [end, setEnd] = useState("15:00");
  const [type, setType] = useState<TimeBlockType>("timeBlock");
  const selectedKey = toDateKey(store.calendarDate);

  const movePeriod = (direction: -1 | 1) => {
    if (store.calendarMode === "month") store.setCalendarDate(addMonths(store.calendarDate, direction));
    if (store.calendarMode === "week") store.setCalendarDate(addDays(store.calendarDate, direction * 7));
    if (store.calendarMode === "day") store.setCalendarDate(addDays(store.calendarDate, direction));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Plan / Execute"
        title="캘린더"
        description="작업, 루틴, 프로젝트 마일스톤을 시간 위에 배치하는 개인 일정판입니다."
        action={
        <div className="flex flex-wrap items-center gap-2">
          {(["month", "week", "day"] as const).map((mode) => (
            <Button key={mode} variant={store.calendarMode === mode ? "primary" : "secondary"} onClick={() => store.setCalendarMode(mode)}>
              {mode === "month" ? "월" : mode === "week" ? "주" : "일"}
            </Button>
          ))}
          <Button onClick={() => store.setCalendarDate(new Date())}>오늘</Button>
          <Button className="h-9 w-9 px-0" onClick={() => movePeriod(-1)}><ChevronLeft size={16} /></Button>
          <Button className="h-9 w-9 px-0" onClick={() => movePeriod(1)}><ChevronRight size={16} /></Button>
        </div>
        }
      />

      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-ink">{formatMonthTitle(store.calendarDate)}</h2>
          <div className="grid w-full gap-2 md:w-auto md:grid-cols-[180px_90px_90px_120px_auto]">
            <Input placeholder="새 블록" value={title} onChange={(event) => setTitle(event.target.value)} />
            <Input type="time" value={start} onChange={(event) => setStart(event.target.value)} />
            <Input type="time" value={end} onChange={(event) => setEnd(event.target.value)} />
            <select className="h-10 rounded-md border border-line px-2 text-sm" value={type} onChange={(event) => setType(event.target.value as TimeBlockType)}>
              {(Object.keys(timeBlockTypeLabels) as TimeBlockType[]).map((key) => (
                <option key={key} value={key}>{timeBlockTypeLabels[key]}</option>
              ))}
            </select>
            <Button
              variant="primary"
              onClick={() => {
                if (!title.trim()) return;
                store.addTimeBlock({ title: title.trim(), start, end, date: selectedKey, type });
                setTitle("");
              }}
            >
              <Plus size={16} /> 생성
            </Button>
          </div>
        </div>
        {store.calendarMode === "month" ? <MonthGrid store={store} /> : null}
        {store.calendarMode === "week" ? <WeekGrid store={store} /> : null}
        {store.calendarMode === "day" ? <DayGrid store={store} /> : null}
      </Card>
    </div>
  );
}

function MonthGrid({ store }: { store: AppStore }) {
  const data = store.data!;
  const days = getMonthGrid(store.calendarDate);
  return (
    <div>
      <div className="grid grid-cols-7 border-b border-line text-center text-xs font-medium text-muted">
        {weekLabels.map((day) => <div key={day} className="py-2">{day}</div>)}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const key = toDateKey(day);
          const blocks = data.timeBlocks.filter((block) => block.date === key);
          const tasks = data.tasks.filter((task) => task.date === key);
          return (
            <button
              key={key}
              className={`min-h-28 border-b border-r border-line p-2 text-left hover:bg-[#f7f5ef] ${
                key === toDateKey() ? "bg-[#f3f6ef]" : ""
              }`}
              onClick={() => {
                store.setCalendarDate(day);
                store.setCalendarMode("day");
              }}
            >
              <div className="text-sm font-medium text-ink">{day.getDate()}</div>
              {[...blocks, ...tasks].slice(0, 3).map((item) => (
                <div key={item.id} className="mt-1 truncate rounded border border-line bg-white px-2 py-1 text-xs text-muted">
                  {item.title}
                </div>
              ))}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function WeekGrid({ store }: { store: AppStore }) {
  const data = store.data!;
  const days = getWeekDays(store.calendarDate);
  return (
    <div className="grid gap-3 lg:grid-cols-7">
      {days.map((day) => {
        const key = toDateKey(day);
        const blocks = data.timeBlocks.filter((block) => block.date === key).sort((a, b) => a.start.localeCompare(b.start));
        const tasks = data.tasks.filter((task) => task.date === key);
        return (
          <div key={key} className="min-h-96 rounded-md border border-line bg-[#fdfcf8] p-3">
            <button className="mb-3 text-left" onClick={() => { store.setCalendarDate(day); store.setCalendarMode("day"); }}>
              <div className="text-xs text-muted">{weekLabels[day.getDay()]}</div>
              <div className="text-lg font-semibold text-ink">{day.getDate()}</div>
            </button>
            <div className="space-y-2">
              {blocks.map((block) => (
                <button key={block.id} className="w-full rounded-md border border-line bg-white p-2 text-left text-sm hover:border-sage" onClick={() => store.setInspectorItem({ kind: "timeBlock", id: block.id })}>
                  <div className="font-medium text-ink">{block.title}</div>
                  <div className="text-xs text-muted">{block.start} - {block.end}</div>
                </button>
              ))}
              {tasks.map((task) => (
                <button key={task.id} className="w-full rounded-md border border-line bg-white p-2 text-left text-sm hover:border-sage" onClick={() => store.setInspectorItem({ kind: "task", id: task.id })}>
                  {task.title}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DayGrid({ store }: { store: AppStore }) {
  const data = store.data!;
  const key = toDateKey(store.calendarDate);
  const blocks = data.timeBlocks.filter((block) => block.date === key).sort((a, b) => a.start.localeCompare(b.start));
  const tasks = data.tasks.filter((task) => task.date === key);

  return (
    <div className="grid gap-3">
      {[...blocks, ...tasks].length ? [...blocks, ...tasks].map((item) => (
        <button
          key={item.id}
          className="grid gap-3 rounded-md border border-line bg-white p-4 text-left hover:border-sage md:grid-cols-[120px_1fr]"
          onClick={() => store.setInspectorItem("start" in item ? { kind: "timeBlock", id: item.id } : { kind: "task", id: item.id })}
        >
          <div className="text-sm text-muted">{"start" in item ? `${item.start} - ${item.end}` : "작업"}</div>
          <div>
            <div className="font-semibold text-ink">{item.title}</div>
            <div className="mt-1 text-sm text-muted">{"note" in item ? item.note : ""}</div>
          </div>
        </button>
      )) : <EmptyState title="선택한 날짜에 일정이 없습니다" description="상단 입력창에서 작업이나 타임블록을 새로 만들 수 있습니다." />}
    </div>
  );
}
