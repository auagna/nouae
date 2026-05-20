import type { ProjectStatus, TaskStatus, TimeBlockType, ViewKey } from "@/types";

export const viewLabels: Record<ViewKey, string> = {
  home: "홈",
  inbox: "인박스",
  today: "오늘",
  calendar: "캘린더",
  projects: "프로젝트",
  review: "리뷰",
  settings: "설정"
};

export const taskStatusLabels: Record<TaskStatus, string> = {
  todo: "예정",
  doing: "진행",
  done: "완료"
};

export const projectStatusLabels: Record<ProjectStatus, string> = {
  active: "진행",
  paused: "보류",
  completed: "완료"
};

export const timeBlockTypeLabels: Record<TimeBlockType, string> = {
  task: "작업",
  timeBlock: "블록",
  projectMilestone: "마일스톤",
  routine: "루틴"
};

export const loopStages = ["Capture", "Plan", "Execute", "Log", "Review", "Refine"];
