"use client";

import { Menu } from "lucide-react";
import { CalendarView } from "@/components/calendar/CalendarView";
import { HomeView } from "@/components/home/HomeView";
import { InboxView } from "@/components/inbox/InboxView";
import { ProjectsView } from "@/components/projects/ProjectsView";
import { ReviewView } from "@/components/review/ReviewView";
import { SettingsView } from "@/components/settings/SettingsView";
import { TodayView } from "@/components/today/TodayView";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/store/useAppStore";
import { Sidebar } from "./Sidebar";
import { RightInspector } from "./RightInspector";

export function AppShell() {
  const store = useAppStore();

  if (!store.data) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted">nou ae 불러오는 중...</div>;
  }

  const views = {
    home: <HomeView store={store} />,
    inbox: <InboxView store={store} />,
    today: <TodayView store={store} />,
    calendar: <CalendarView store={store} />,
    projects: <ProjectsView store={store} />,
    review: <ReviewView store={store} />,
    settings: <SettingsView store={store} />
  };

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar store={store} />
      <main className="min-w-0 flex-1">
        <div className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line bg-paper/95 px-4 backdrop-blur md:hidden">
          <Button className="h-9 w-9 px-0" variant="ghost" onClick={() => store.setSidebarCollapsed(false)}>
            <Menu size={18} />
          </Button>
          <div className="font-semibold">nou ae</div>
          <div className="w-9" />
        </div>
        <div className="mx-auto max-w-7xl px-5 py-6 lg:px-8">{views[store.activeView]}</div>
      </main>
      <RightInspector store={store} />
    </div>
  );
}
