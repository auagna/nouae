import type { AppData } from "@/types";
import { nowIso, toDateKey } from "./date";

const today = toDateKey();
const createdAt = nowIso();

export const seedData: AppData = {
  todayFocus: "오늘의 실행 리듬을 작게 닫기",
  quickMemo: "오전에는 계획을 단단히 잡고, 오후에는 산출물을 남긴다.",
  inboxItems: [
    {
      id: "inbox_seed_1",
      title: "포트폴리오 메인 섹션 정리",
      note: "최근 작업 3개를 선별하고 설명 문장을 다시 쓴다.",
      status: "raw",
      createdAt,
      updatedAt: createdAt
    },
    {
      id: "inbox_seed_2",
      title: "운동 루틴 조정",
      note: "평일 30분 루틴으로 낮추고 지속성 확인.",
      status: "raw",
      createdAt,
      updatedAt: createdAt
    }
  ],
  tasks: [
    {
      id: "task_seed_1",
      title: "오늘 핵심 작업 1개 완료",
      note: "완료 조건을 먼저 적고 시작한다.",
      status: "doing",
      date: today,
      projectId: "project_seed_2",
      createdAt,
      updatedAt: createdAt
    },
    {
      id: "task_seed_2",
      title: "저녁 회고 작성",
      note: "완료, 놓친 것, 내일 다듬을 점.",
      status: "todo",
      date: today,
      createdAt,
      updatedAt: createdAt
    }
  ],
  timeBlocks: [
    {
      id: "block_seed_1",
      title: "집중 제작",
      start: "09:30",
      end: "11:30",
      date: today,
      type: "timeBlock",
      projectId: "project_seed_3",
      note: "방해 요소 제거"
    },
    {
      id: "block_seed_2",
      title: "리뷰와 정리",
      start: "17:00",
      end: "17:40",
      date: today,
      type: "routine",
      note: "로그 남기기"
    }
  ],
  projects: [
    {
      id: "project_seed_1",
      title: "운동",
      description: "체력과 컨디션을 유지하는 개인 루틴.",
      status: "active",
      tasks: [],
      widgets: [
        {
          id: "widget_seed_1",
          type: "checklist",
          title: "이번 주 기준",
          content: "",
          items: [
            { id: "wi_1", title: "근력 2회", done: false },
            { id: "wi_2", title: "산책 3회", done: true }
          ]
        }
      ],
      logs: [],
      createdAt,
      updatedAt: createdAt
    },
    {
      id: "project_seed_2",
      title: "데일리 디자인",
      description: "매일 작은 디자인 산출물을 남기는 훈련.",
      status: "active",
      tasks: [],
      widgets: [
        {
          id: "widget_seed_2",
          type: "memo",
          title: "방향",
          content: "완성도보다 매일의 반복과 관찰을 우선한다."
        }
      ],
      logs: [],
      createdAt,
      updatedAt: createdAt
    },
    {
      id: "project_seed_3",
      title: "1일 1프로그램 제작",
      description: "작은 앱을 빠르게 만들고 배운 점을 기록한다.",
      status: "active",
      tasks: [],
      widgets: [],
      logs: [],
      createdAt,
      updatedAt: createdAt
    }
  ],
  moodLogs: [
    {
      id: "mood_seed_1",
      date: today,
      moodScore: 4,
      energyScore: 3,
      note: "차분하지만 오후 에너지 관리가 필요함."
    }
  ],
  reviews: [],
  recents: [
    { id: "recent_seed_1", label: "오늘 실행", view: "today", createdAt },
    { id: "recent_seed_2", label: "데일리 디자인", view: "projects", createdAt }
  ]
};
