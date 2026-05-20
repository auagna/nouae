"use client";

import { X } from "lucide-react";
import type { AppStore } from "@/store/useAppStore";
import { projectStatusLabels, taskStatusLabels } from "@/lib/labels";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Field";

export function RightInspector({ store }: { store: AppStore }) {
  const data = store.data;
  const item = store.inspectorItem;
  if (!data || !item) return null;

  const task = item.kind === "task" ? data.tasks.find((entry) => entry.id === item.id) : undefined;
  const block = item.kind === "timeBlock" ? data.timeBlocks.find((entry) => entry.id === item.id) : undefined;
  const project = item.kind === "project" ? data.projects.find((entry) => entry.id === item.id) : undefined;
  const inbox = item.kind === "inbox" ? data.inboxItems.find((entry) => entry.id === item.id) : undefined;

  return (
    <aside className="w-[340px] shrink-0 border-l border-line bg-panel p-5 max-xl:hidden">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">Inspector</div>
          <h2 className="mt-1 text-lg font-semibold text-ink">상세 패널</h2>
        </div>
        <Button className="h-8 w-8 px-0" variant="ghost" onClick={() => store.setInspectorItem(null)}>
          <X size={16} />
        </Button>
      </div>

      {task ? (
        <div className="space-y-3">
          <Input value={task.title} onChange={(event) => store.updateTask(task.id, { title: event.target.value })} />
          <Textarea value={task.note} onChange={(event) => store.updateTask(task.id, { note: event.target.value })} />
          <select
            className="h-10 w-full rounded-md border border-line px-3 text-sm"
            value={task.status}
            onChange={(event) => store.updateTask(task.id, { status: event.target.value as typeof task.status })}
          >
            {Object.entries(taskStatusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <Button variant="danger" onClick={() => store.deleteTask(task.id)}>
            삭제
          </Button>
        </div>
      ) : null}

      {block ? (
        <div className="space-y-3">
          <Input value={block.title} onChange={(event) => store.updateTimeBlock(block.id, { title: event.target.value })} />
          <div className="grid grid-cols-2 gap-2">
            <Input value={block.start} onChange={(event) => store.updateTimeBlock(block.id, { start: event.target.value })} />
            <Input value={block.end} onChange={(event) => store.updateTimeBlock(block.id, { end: event.target.value })} />
          </div>
          <Textarea value={block.note ?? ""} onChange={(event) => store.updateTimeBlock(block.id, { note: event.target.value })} />
          <Button variant="danger" onClick={() => store.deleteTimeBlock(block.id)}>
            삭제
          </Button>
        </div>
      ) : null}

      {project ? (
        <div className="space-y-3">
          <Input value={project.title} onChange={(event) => store.updateProject(project.id, { title: event.target.value })} />
          <Textarea
            value={project.description}
            onChange={(event) => store.updateProject(project.id, { description: event.target.value })}
          />
          <select
            className="h-10 w-full rounded-md border border-line px-3 text-sm"
            value={project.status}
            onChange={(event) => store.updateProject(project.id, { status: event.target.value as typeof project.status })}
          >
            {Object.entries(projectStatusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <Button variant="danger" onClick={() => store.deleteProject(project.id)}>
            프로젝트 삭제
          </Button>
        </div>
      ) : null}

      {inbox ? (
        <div className="space-y-3">
          <Input value={inbox.title} onChange={(event) => store.updateInboxItem(inbox.id, { title: event.target.value })} />
          <Textarea value={inbox.note} onChange={(event) => store.updateInboxItem(inbox.id, { note: event.target.value })} />
          <Button onClick={() => store.moveInboxToToday(inbox)}>오늘로 이동</Button>
        </div>
      ) : null}
    </aside>
  );
}
