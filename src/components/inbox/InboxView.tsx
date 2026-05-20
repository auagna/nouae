"use client";

import { Archive, CalendarPlus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { AppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/Button";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Field";

export function InboxView({ store }: { store: AppStore }) {
  const data = store.data!;
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  function submit() {
    if (!title.trim()) return;
    store.addInboxItem(title.trim(), note.trim());
    setTitle("");
    setNote("");
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-sage">Capture</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">인박스</h1>
      </header>
      <Card>
        <SectionTitle title="빠른 캡처" caption="정리 전 생각, 할 일, 링크, 아이디어를 모읍니다." />
        <div className="grid gap-3 lg:grid-cols-[0.7fr_1fr_auto]">
          <Input placeholder="제목" value={title} onChange={(event) => setTitle(event.target.value)} />
          <Input placeholder="메모" value={note} onChange={(event) => setNote(event.target.value)} />
          <Button variant="primary" onClick={submit}>추가</Button>
        </div>
      </Card>

      <div className="grid gap-4">
        {data.inboxItems.map((item) => (
          <Card key={item.id} className={item.status === "processed" ? "opacity-70" : ""}>
            <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
              <button className="text-left" onClick={() => store.setInspectorItem({ kind: "inbox", id: item.id })}>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-ink">{item.title}</h2>
                  <span className="rounded border border-line px-2 py-1 text-xs text-muted">
                    {item.status === "raw" ? "raw" : "processed"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted">{item.note || "메모 없음"}</p>
              </button>
              <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                <Button onClick={() => store.updateInboxItem(item.id, { status: "processed" })}>
                  <Archive size={15} /> 처리
                </Button>
                <Button onClick={() => store.moveInboxToToday(item)}>
                  <CalendarPlus size={15} /> 오늘
                </Button>
                <select
                  className="h-9 rounded-md border border-line bg-white px-2 text-sm"
                  defaultValue=""
                  onChange={(event) => event.target.value && store.moveInboxToProject(item, event.target.value)}
                >
                  <option value="">프로젝트로</option>
                  {data.projects.map((project) => (
                    <option key={project.id} value={project.id}>{project.title}</option>
                  ))}
                </select>
                <Button variant="danger" onClick={() => store.deleteInboxItem(item.id)}>
                  <Trash2 size={15} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
