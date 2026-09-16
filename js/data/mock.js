
export const projects = [
  {
    id: "my-app",
    name: "MyApp",
    color: "#79b8ff",
    recordCount: 24,
  },
  {
    id: "side-project",
    name: "Side Project",
    color: "#79b8ff",
    recordCount: 12,
  },
  {
    id: "cli-tool",
    name: "CLI Tool",
    color: "#f5c76b",
    recordCount: 7,
  },
];

export const projectContext = {
  currentStatus:
    "개인 개발자의 아이디어와 작업 맥락을 프로젝트별로 기록하는 MVP를 만드는 중.",

  problem:
    '메모는 남아 있지만 시간이 지나면 "왜 이런 생각을 했는지" 알 수 없게 된다. 생각과 프로젝트의 맥락을 함께 저장하는 것이 핵심.',

  nextActions: [
    "빠른 기록 플로우 구현",
    "프로젝트 자동 선택",
    "기록 상세 화면 설계",
  ],

  technologies: [
    "Next.js",
    "TypeScript",
    "SQLite",
    "Drizzle",
  ],

  totalRecords: 24,
  weeklyRecords: 8,
};

export const timeline = [
  {
    date: "오늘 · 2026년 8월 29일",
    entries: [
      {
        id: "record-1",
        time: "13:42",
        tag: "Architecture",
        title: "SQLite로 바꾸면 될 듯",
        context:
          "현재 JSON 파일 기반 저장 방식 때문에 검색과 동시 수정이 불편하다. 프로젝트 규모가 커지면 SQLite가 더 단순할 것 같다.",
        status: {
          label: "검토 필요",
          color: "var(--yellow)",
        },
        related: ["SQLite"],
      },
      {
        id: "record-2",
        time: "11:18",
        tag: "UX",
        title: "기록할 때 프로젝트 선택하는 과정 없애기",
        context:
          "이동 중에는 프로젝트를 선택하는 것조차 귀찮다. 마지막으로 작업한 프로젝트를 기본값으로 사용하고 필요할 때만 변경하는 방식이 좋을 듯.",
        status: {
          label: "아이디어",
          color: "var(--green)",
        },
      },
    ],
  },

  {
    date: "어제 · 2026년 8월 28일",
    entries: [
      {
        id: "record-3",
        time: "18:34",
        tag: "Problem",
        title:
          "프로젝트를 다시 열었을 때 맥락이 너무 부족함",
        context:
          '2주 만에 코드를 열었더니 마지막으로 무엇을 하려고 했는지 기억나지 않았다. 단순한 TODO보다 생각의 이유를 남겨야 한다.',
        status: {
          label: "핵심 문제",
          color: "var(--red)",
        },
      },
    ],
  },
];
