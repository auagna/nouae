import type { AppData } from "@/types";
import { addDays, toDateKey } from "./date";

export function getTasksForDate(data: AppData, dateKey: string) {
  return data.tasks.filter((task) => task.date === dateKey);
}

export function getTimeBlocksForDate(data: AppData, dateKey: string) {
  return data.timeBlocks
    .filter((block) => block.date === dateKey)
    .sort((a, b) => a.start.localeCompare(b.start));
}

export function getTodayOverview(data: AppData, dateKey = toDateKey()) {
  const tasks = getTasksForDate(data, dateKey);
  const blocks = getTimeBlocksForDate(data, dateKey);
  const completedTasks = tasks.filter((task) => task.status === "done");
  const rawInboxItems = data.inboxItems.filter((item) => item.status === "raw");
  const activeProjects = data.projects.filter((project) => project.status === "active");
  const moodLog = data.moodLogs.find((log) => log.date === dateKey);
  const completionRate = tasks.length ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  return {
    tasks,
    blocks,
    completedTasks,
    rawInboxItems,
    activeProjects,
    moodLog,
    completionRate
  };
}

export function getSevenDaySummary(data: AppData, anchorDate = new Date()) {
  const dateKeys = Array.from({ length: 7 }, (_, index) => toDateKey(addDays(anchorDate, index - 6)));
  const tasks = data.tasks.filter((task) => dateKeys.includes(task.date));
  const completedTasks = tasks.filter((task) => task.status === "done");
  const missedTasks = tasks.filter((task) => task.status !== "done" && task.date < toDateKey(anchorDate));
  const moodLogs = data.moodLogs.filter((log) => dateKeys.includes(log.date));
  const moodAverage = moodLogs.length
    ? Number((moodLogs.reduce((sum, log) => sum + log.moodScore, 0) / moodLogs.length).toFixed(1))
    : 0;
  const energyAverage = moodLogs.length
    ? Number((moodLogs.reduce((sum, log) => sum + log.energyScore, 0) / moodLogs.length).toFixed(1))
    : 0;
  const completionRate = tasks.length ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  return {
    dateKeys,
    tasks,
    completedTasks,
    missedTasks,
    moodLogs,
    moodAverage,
    energyAverage,
    completionRate
  };
}

export function getProjectProgress(data: AppData, projectId: string) {
  const tasks = data.tasks.filter((task) => task.projectId === projectId);
  const done = tasks.filter((task) => task.status === "done").length;
  return {
    tasks,
    done,
    total: tasks.length,
    completionRate: tasks.length ? Math.round((done / tasks.length) * 100) : 0
  };
}
