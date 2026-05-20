export type ViewKey = "home" | "inbox" | "today" | "calendar" | "projects" | "review" | "settings";

export type InboxStatus = "raw" | "processed";
export type TaskStatus = "todo" | "doing" | "done";
export type ProjectStatus = "active" | "paused" | "completed";
export type CalendarMode = "month" | "week" | "day";
export type TimeBlockType = "task" | "timeBlock" | "projectMilestone" | "routine";

export interface InboxItem {
  id: string;
  title: string;
  note: string;
  status: InboxStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  note: string;
  status: TaskStatus;
  date: string;
  projectId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimeBlock {
  id: string;
  title: string;
  start: string;
  end: string;
  date: string;
  type: TimeBlockType;
  projectId?: string;
  note?: string;
}

export interface ProjectWidget {
  id: string;
  type: "memo" | "checklist";
  title: string;
  content: string;
  items?: Array<{ id: string; title: string; done: boolean }>;
}

export interface ProjectLog {
  id: string;
  date: string;
  note: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  tasks: Task[];
  widgets: ProjectWidget[];
  logs: ProjectLog[];
  createdAt: string;
  updatedAt: string;
}

export interface MoodLog {
  id: string;
  date: string;
  moodScore: 1 | 2 | 3 | 4 | 5;
  energyScore: 1 | 2 | 3 | 4 | 5;
  note: string;
}

export interface Review {
  id: string;
  date: string;
  completedSummary: string;
  missedSummary: string;
  reflection: string;
  refineNext: string;
}

export interface RecentItem {
  id: string;
  label: string;
  view: ViewKey;
  createdAt: string;
}

export interface AppData {
  inboxItems: InboxItem[];
  tasks: Task[];
  timeBlocks: TimeBlock[];
  projects: Project[];
  moodLogs: MoodLog[];
  reviews: Review[];
  recents: RecentItem[];
  todayFocus: string;
  quickMemo: string;
}

export type InspectorItem =
  | { kind: "task"; id: string }
  | { kind: "timeBlock"; id: string }
  | { kind: "project"; id: string }
  | { kind: "inbox"; id: string }
  | null;
