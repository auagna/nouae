"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { AppStore } from "@/store/useAppStore";
import { toDateKey } from "@/lib/date";
import { Button } from "@/components/ui/Button";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Field";

export function ProjectsView({ store }: { store: AppStore }) {
  const data = store.data!;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedId, setSelectedId] = useState(data.projects[0]?.id ?? "");
  const selected = data.projects.find((project) => project.id === selectedId) ?? data.projects[0];
  const [taskTitle, setTaskTitle] = useState("");
  const [memoTitle, setMemoTitle] = useState("");

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-sage">Plan / Refine</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">프로젝트</h1>
      </header>

      <Card>
        <SectionTitle title="프로젝트 생성" />
        <div className="grid gap-3 lg:grid-cols-[220px_1fr_auto]">
          <Input placeholder="프로젝트명" value={title} onChange={(event) => setTitle(event.target.value)} />
          <Input placeholder="설명" value={description} onChange={(event) => setDescription(event.target.value)} />
          <Button
            variant="primary"
            onClick={() => {
              if (!title.trim()) return;
              const id = store.addProject(title.trim(), description.trim());
              setSelectedId(id);
              setTitle("");
              setDescription("");
            }}
          >
            <Plus size={16} /> 생성
          </Button>
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
        <div className="space-y-3">
          {data.projects.map((project) => (
            <button
              key={project.id}
              className={`w-full rounded-lg border p-4 text-left transition ${
                selected?.id === project.id ? "border-sage bg-panel shadow-soft" : "border-line bg-panel hover:border-sage"
              }`}
              onClick={() => {
                setSelectedId(project.id);
                store.setInspectorItem({ kind: "project", id: project.id });
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-semibold text-ink">{project.title}</h2>
                <span className="rounded border border-line px-2 py-1 text-xs text-muted">{statusLabel(project.status)}</span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-muted">{project.description}</p>
            </button>
          ))}
        </div>

        {selected ? (
          <Card>
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-ink">{selected.title}</h2>
                <p className="mt-2 text-sm text-muted">{selected.description}</p>
              </div>
              <Button variant="danger" onClick={() => store.deleteProject(selected.id)}>
                <Trash2 size={15} /> 삭제
              </Button>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <section>
                <SectionTitle title="프로젝트 체크리스트" />
                <div className="mb-3 flex gap-2">
                  <Input placeholder="프로젝트 작업" value={taskTitle} onChange={(event) => setTaskTitle(event.target.value)} />
                  <Button
                    onClick={() => {
                      if (!taskTitle.trim()) return;
                      store.addTask({ title: taskTitle.trim(), note: "", date: toDateKey(), projectId: selected.id });
                      setTaskTitle("");
                    }}
                  >
                    추가
                  </Button>
                </div>
                <div className="space-y-2">
                  {data.tasks.filter((task) => task.projectId === selected.id).map((task) => (
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
              </section>

              <section>
                <SectionTitle title="메모 위젯" />
                <div className="mb-3 space-y-2">
                  <Input placeholder="메모 제목" value={memoTitle} onChange={(event) => setMemoTitle(event.target.value)} />
                  <Textarea id="projectMemoContent" placeholder="내용" />
                  <Button
                    onClick={() => {
                      const content = (document.getElementById("projectMemoContent") as HTMLTextAreaElement | null)?.value ?? "";
                      if (!memoTitle.trim()) return;
                      store.addProjectWidget(selected.id, memoTitle.trim(), content);
                      setMemoTitle("");
                      const field = document.getElementById("projectMemoContent") as HTMLTextAreaElement | null;
                      if (field) field.value = "";
                    }}
                  >
                    메모 추가
                  </Button>
                </div>
                <div className="space-y-2">
                  {selected.widgets.map((widget) => (
                    <div key={widget.id} className="rounded-md border border-line p-3">
                      <div className="font-medium text-ink">{widget.title}</div>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-muted">{widget.content}</p>
                      {widget.items?.map((item) => (
                        <div key={item.id} className="mt-2 text-sm text-muted">{item.done ? "완료" : "예정"} · {item.title}</div>
                      ))}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

function statusLabel(status: string) {
  if (status === "active") return "진행";
  if (status === "paused") return "보류";
  return "완료";
}
