"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  AppData,
  CalendarMode,
  InboxItem,
  InspectorItem,
  MoodLog,
  Project,
  ProjectStatus,
  Review,
  Task,
  TaskStatus,
  TimeBlock,
  TimeBlockType,
  ViewKey
} from "@/types";
import { makeId, nowIso, toDateKey } from "@/lib/date";
import { exportAppData, loadAppData, parseImportedData, resetAppData, saveAppData } from "@/lib/storage";

type DraftTask = Pick<Task, "title" | "note" | "date"> & { projectId?: string };
type DraftTimeBlock = Pick<TimeBlock, "title" | "start" | "end" | "date"> & {
  type?: TimeBlockType;
  projectId?: string;
  note?: string;
};

export function useAppStore() {
  const [data, setData] = useState<AppData | null>(null);
  const [activeView, setActiveView] = useState<ViewKey>("home");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [inspectorItem, setInspectorItem] = useState<InspectorItem>(null);
  const [calendarMode, setCalendarMode] = useState<CalendarMode>("week");
  const [calendarDate, setCalendarDate] = useState(new Date());

  useEffect(() => {
    setData(loadAppData());
  }, []);

  const commit = useCallback((updater: (current: AppData) => AppData) => {
    setData((current) => {
      const base = current ?? loadAppData();
      const next = updater(base);
      saveAppData(next);
      return next;
    });
  }, []);

  const addRecent = useCallback(
    (label: string, view: ViewKey) => {
      commit((current) => ({
        ...current,
        recents: [
          { id: makeId("recent"), label, view, createdAt: nowIso() },
          ...current.recents.filter((item) => item.label !== label)
        ].slice(0, 6)
      }));
    },
    [commit]
  );

  const navigate = useCallback(
    (view: ViewKey) => {
      setActiveView(view);
      setInspectorItem(null);
    },
    []
  );

  const addInboxItem = useCallback(
    (title: string, note: string) => {
      const timestamp = nowIso();
      commit((current) => ({
        ...current,
        inboxItems: [
          { id: makeId("inbox"), title, note, status: "raw", createdAt: timestamp, updatedAt: timestamp },
          ...current.inboxItems
        ]
      }));
      addRecent(title, "inbox");
    },
    [addRecent, commit]
  );

  const updateInboxItem = useCallback(
    (id: string, patch: Partial<InboxItem>) => {
      commit((current) => ({
        ...current,
        inboxItems: current.inboxItems.map((item) =>
          item.id === id ? { ...item, ...patch, updatedAt: nowIso() } : item
        )
      }));
    },
    [commit]
  );

  const deleteInboxItem = useCallback(
    (id: string) => {
      commit((current) => ({ ...current, inboxItems: current.inboxItems.filter((item) => item.id !== id) }));
    },
    [commit]
  );

  const addTask = useCallback(
    (draft: DraftTask) => {
      const timestamp = nowIso();
      const task: Task = {
        id: makeId("task"),
        title: draft.title,
        note: draft.note,
        status: "todo",
        date: draft.date,
        projectId: draft.projectId,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      commit((current) => ({
        ...current,
        tasks: [task, ...current.tasks],
        projects: draft.projectId
          ? current.projects.map((project) =>
              project.id === draft.projectId
                ? { ...project, tasks: [task, ...project.tasks], updatedAt: timestamp }
                : project
            )
          : current.projects
      }));
      addRecent(task.title, draft.projectId ? "projects" : "today");
      return task.id;
    },
    [addRecent, commit]
  );

  const updateTask = useCallback(
    (id: string, patch: Partial<Task>) => {
      const timestamp = nowIso();
      commit((current) => ({
        ...current,
        tasks: current.tasks.map((task) => (task.id === id ? { ...task, ...patch, updatedAt: timestamp } : task)),
        projects: current.projects.map((project) => ({
          ...project,
          tasks: project.tasks.map((task) => (task.id === id ? { ...task, ...patch, updatedAt: timestamp } : task))
        }))
      }));
    },
    [commit]
  );

  const deleteTask = useCallback(
    (id: string) => {
      commit((current) => ({
        ...current,
        tasks: current.tasks.filter((task) => task.id !== id),
        projects: current.projects.map((project) => ({
          ...project,
          tasks: project.tasks.filter((task) => task.id !== id)
        }))
      }));
    },
    [commit]
  );

  const addTimeBlock = useCallback(
    (draft: DraftTimeBlock) => {
      const block: TimeBlock = {
        id: makeId("block"),
        title: draft.title,
        start: draft.start,
        end: draft.end,
        date: draft.date,
        type: draft.type ?? "timeBlock",
        projectId: draft.projectId,
        note: draft.note
      };
      commit((current) => ({ ...current, timeBlocks: [block, ...current.timeBlocks] }));
      addRecent(block.title, "calendar");
      return block.id;
    },
    [addRecent, commit]
  );

  const updateTimeBlock = useCallback(
    (id: string, patch: Partial<TimeBlock>) => {
      commit((current) => ({
        ...current,
        timeBlocks: current.timeBlocks.map((block) => (block.id === id ? { ...block, ...patch } : block))
      }));
    },
    [commit]
  );

  const deleteTimeBlock = useCallback(
    (id: string) => {
      commit((current) => ({ ...current, timeBlocks: current.timeBlocks.filter((block) => block.id !== id) }));
    },
    [commit]
  );

  const addProject = useCallback(
    (title: string, description: string) => {
      const timestamp = nowIso();
      const project: Project = {
        id: makeId("project"),
        title,
        description,
        status: "active",
        tasks: [],
        widgets: [],
        logs: [],
        createdAt: timestamp,
        updatedAt: timestamp
      };
      commit((current) => ({ ...current, projects: [project, ...current.projects] }));
      addRecent(title, "projects");
      return project.id;
    },
    [addRecent, commit]
  );

  const updateProject = useCallback(
    (id: string, patch: Partial<Pick<Project, "title" | "description">> & { status?: ProjectStatus }) => {
      commit((current) => ({
        ...current,
        projects: current.projects.map((project) =>
          project.id === id ? { ...project, ...patch, updatedAt: nowIso() } : project
        )
      }));
    },
    [commit]
  );

  const deleteProject = useCallback(
    (id: string) => {
      commit((current) => ({
        ...current,
        projects: current.projects.filter((project) => project.id !== id),
        tasks: current.tasks.map((task) => (task.projectId === id ? { ...task, projectId: undefined } : task)),
        timeBlocks: current.timeBlocks.map((block) => (block.projectId === id ? { ...block, projectId: undefined } : block))
      }));
      setInspectorItem(null);
    },
    [commit]
  );

  const addProjectWidget = useCallback(
    (projectId: string, title: string, content: string) => {
      commit((current) => ({
        ...current,
        projects: current.projects.map((project) =>
          project.id === projectId
            ? {
                ...project,
                widgets: [{ id: makeId("widget"), type: "memo", title, content }, ...project.widgets],
                updatedAt: nowIso()
              }
            : project
        )
      }));
    },
    [commit]
  );

  const saveMoodLog = useCallback(
    (moodScore: MoodLog["moodScore"], energyScore: MoodLog["energyScore"], note: string, date = toDateKey()) => {
      const log: MoodLog = { id: makeId("mood"), date, moodScore, energyScore, note };
      commit((current) => ({
        ...current,
        moodLogs: [log, ...current.moodLogs.filter((item) => item.date !== date)]
      }));
    },
    [commit]
  );

  const saveReview = useCallback(
    (review: Omit<Review, "id">) => {
      const next: Review = { id: makeId("review"), ...review };
      commit((current) => ({
        ...current,
        reviews: [next, ...current.reviews.filter((item) => item.date !== review.date)]
      }));
      addRecent("일일 회고", "review");
    },
    [addRecent, commit]
  );

  const setTodayFocus = useCallback(
    (todayFocus: string) => commit((current) => ({ ...current, todayFocus })),
    [commit]
  );

  const setQuickMemo = useCallback((quickMemo: string) => commit((current) => ({ ...current, quickMemo })), [commit]);

  const moveInboxToToday = useCallback(
    (item: InboxItem) => {
      addTask({ title: item.title, note: item.note, date: toDateKey() });
      updateInboxItem(item.id, { status: "processed" });
    },
    [addTask, updateInboxItem]
  );

  const moveInboxToProject = useCallback(
    (item: InboxItem, projectId: string) => {
      addTask({ title: item.title, note: item.note, date: toDateKey(), projectId });
      updateInboxItem(item.id, { status: "processed" });
    },
    [addTask, updateInboxItem]
  );

  const resetData = useCallback(() => setData(resetAppData()), []);

  const importData = useCallback((raw: string) => {
    const imported = parseImportedData(raw);
    saveAppData(imported);
    setData(imported);
  }, []);

  const api = useMemo(
    () => ({
      activeView,
      addInboxItem,
      addProject,
      addProjectWidget,
      addTask,
      addTimeBlock,
      calendarDate,
      calendarMode,
      data,
      deleteInboxItem,
      deleteProject,
      deleteTask,
      deleteTimeBlock,
      exportData: () => exportAppData(data ?? loadAppData()),
      importData,
      inspectorItem,
      moveInboxToProject,
      moveInboxToToday,
      navigate,
      resetData,
      saveMoodLog,
      saveReview,
      setActiveView: navigate,
      setCalendarDate,
      setCalendarMode,
      setInspectorItem,
      setQuickMemo,
      setSidebarCollapsed,
      setTodayFocus,
      sidebarCollapsed,
      updateInboxItem,
      updateProject,
      updateTask,
      updateTimeBlock
    }),
    [
      activeView,
      addInboxItem,
      addProject,
      addProjectWidget,
      addTask,
      addTimeBlock,
      calendarDate,
      calendarMode,
      data,
      deleteInboxItem,
      deleteProject,
      deleteTask,
      deleteTimeBlock,
      importData,
      inspectorItem,
      moveInboxToProject,
      moveInboxToToday,
      navigate,
      resetData,
      saveMoodLog,
      saveReview,
      setQuickMemo,
      setTodayFocus,
      sidebarCollapsed,
      updateInboxItem,
      updateProject,
      updateTask,
      updateTimeBlock
    ]
  );

  return api;
}

export type AppStore = ReturnType<typeof useAppStore>;
export type { TaskStatus };
