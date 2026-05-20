"use client";

import { Download, RotateCcw, Upload } from "lucide-react";
import { useRef, useState } from "react";
import type { AppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/Button";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Field";

export function SettingsView({ store }: { store: AppStore }) {
  const [importValue, setImportValue] = useState("");
  const [message, setMessage] = useState("");
  const linkRef = useRef<HTMLAnchorElement | null>(null);

  function downloadJson() {
    const blob = new Blob([store.exportData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    if (!linkRef.current) return;
    linkRef.current.href = url;
    linkRef.current.download = `nou-ae-export-${new Date().toISOString().slice(0, 10)}.json`;
    linkRef.current.click();
    URL.revokeObjectURL(url);
  }

  function importJson() {
    try {
      store.importData(importValue);
      setMessage("가져오기를 완료했습니다.");
      setImportValue("");
    } catch {
      setMessage("JSON 형식을 확인해 주세요.");
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-sage">Preferences</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">설정</h1>
      </header>

      <Card>
        <SectionTitle title="앱 환경" />
        <div className="rounded-md border border-line bg-[#f7f5ef] p-4">
          <div className="font-medium text-ink">테마 모드</div>
          <p className="mt-1 text-sm text-muted">라이트 모드로 고정되어 있습니다. 다크 모드는 추후 확장 영역입니다.</p>
        </div>
      </Card>

      <Card>
        <SectionTitle title="데이터 관리" caption="모든 데이터는 현재 브라우저의 localStorage에 저장됩니다." />
        <div className="flex flex-wrap gap-2">
          <Button onClick={downloadJson}>
            <Download size={16} /> JSON 내보내기
          </Button>
          <Button variant="danger" onClick={() => {
            if (window.confirm("로컬 데이터를 초기화할까요?")) store.resetData();
          }}>
            <RotateCcw size={16} /> 데이터 초기화
          </Button>
          <a ref={linkRef} className="hidden">download</a>
        </div>
      </Card>

      <Card>
        <SectionTitle title="JSON 가져오기" />
        <Textarea value={importValue} onChange={(event) => setImportValue(event.target.value)} placeholder="내보낸 JSON을 붙여넣기" />
        <div className="mt-3 flex items-center gap-3">
          <Button variant="primary" onClick={importJson}>
            <Upload size={16} /> 가져오기
          </Button>
          {message ? <span className="text-sm text-muted">{message}</span> : null}
        </div>
      </Card>
    </div>
  );
}
