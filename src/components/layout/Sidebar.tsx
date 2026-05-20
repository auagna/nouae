"use client";

import { CalendarDays, CheckSquare, ChevronLeft, ChevronRight, Home, Inbox, PanelsTopLeft, RotateCcw, Settings, Target } from "lucide-react";
import type { AppStore } from "@/store/useAppStore";
import type { ViewKey } from "@/types";
import { viewLabels } from "@/lib/labels";
import { Button } from "@/components/ui/Button";

const navItems: Array<{ key: ViewKey; label: string; icon: React.ComponentType<{ size?: number }> }> = [
  { key: "home", label: viewLabels.home, icon: Home },
  { key: "inbox", label: viewLabels.inbox, icon: Inbox },
  { key: "today", label: viewLabels.today, icon: Target },
  { key: "calendar", label: viewLabels.calendar, icon: CalendarDays },
  { key: "projects", label: viewLabels.projects, icon: PanelsTopLeft },
  { key: "review", label: viewLabels.review, icon: RotateCcw },
  { key: "settings", label: viewLabels.settings, icon: Settings }
];

export function Sidebar({ store }: { store: AppStore }) {
  const collapsed = store.sidebarCollapsed;

  return (
    <aside
      className={`flex min-h-screen shrink-0 flex-col border-r border-line bg-[#eeece5] transition-all ${
        collapsed ? "w-[76px]" : "w-[256px]"
      } max-md:fixed max-md:z-30 max-md:${collapsed ? "-translate-x-full" : "translate-x-0"}`}
    >
      <div className="flex h-16 items-center justify-between border-b border-line px-4">
        {!collapsed ? (
          <button className="text-left" onClick={() => store.navigate("home")}>
            <div className="text-lg font-semibold text-ink">nou ae</div>
            <div className="text-xs text-muted">개인 운영 시스템</div>
          </button>
        ) : (
          <button className="mx-auto text-lg font-semibold text-ink" onClick={() => store.navigate("home")}>
            n
          </button>
        )}
        <Button
          aria-label="사이드바 접기"
          className="h-8 w-8 px-0"
          variant="ghost"
          onClick={() => store.setSidebarCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = store.activeView === item.key;
          return (
            <button
              key={item.key}
              className={`flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm font-medium transition ${
                active ? "bg-panel text-ink shadow-sm" : "text-muted hover:bg-[#e5e2d8] hover:text-ink"
              } ${collapsed ? "justify-center" : ""}`}
              onClick={() => store.navigate(item.key)}
              title={item.label}
            >
              <Icon size={17} />
              {!collapsed ? <span>{item.label}</span> : null}
            </button>
          );
        })}
      </nav>

      {!collapsed ? (
        <div className="border-t border-line p-4">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted">Recents</div>
          <div className="space-y-1">
            {(store.data?.recents ?? []).map((item) => (
              <button
                key={item.id}
                className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-muted hover:bg-panel hover:text-ink"
                onClick={() => store.navigate(item.view)}
              >
                <CheckSquare size={14} />
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </aside>
  );
}
