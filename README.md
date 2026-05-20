# nou ae

`nou ae`는 개인용 폐쇄 루프 자기관리 웹 앱입니다.

핵심 흐름은 `Capture -> Plan -> Execute -> Log -> Review -> Refine`입니다. 현재 v1은 백엔드, 인증, 결제 없이 브라우저 `localStorage`에 데이터를 저장하는 첫 MVP입니다.

## 실행

```bash
npm.cmd install
npm.cmd run dev
```

PowerShell 실행 정책에 따라 `npm`이 막히면 `npm.cmd`를 사용하세요.

## 주요 기능

- 홈: 오늘의 포커스, 타임블록, 프로젝트, 데일리 체크리스트, 무드/에너지 로그
- 인박스: 생각과 작업 캡처, 처리, 오늘/프로젝트 이동
- 오늘: 포커스 문장, 체크리스트, 타임블록, 빠른 메모
- 캘린더: 월/주/일 보기, 타임블록 생성, 작업 표시, 상세 패널
- 프로젝트: 개인 프로젝트, 체크리스트, 메모 위젯, 상태 관리
- 리뷰: 일일 회고 저장, 완료/미완료 요약, 간단한 주간 요약
- 설정: 로컬 데이터 초기화, JSON 내보내기/가져오기

## 기술 구조

- Next.js App Router
- TypeScript
- Tailwind CSS
- React functional components
- 단일 localStorage 유틸리티와 custom store
- 향후 auth, billing, backend 전환을 고려한 `lib`, `store`, `types`, `components` 분리

## v1 범위

이 버전은 개인 단일 사용자 MVP입니다. 팀, 워크스페이스, 공유 프로젝트, 댓글, 초대, 로그인, 결제 기능은 포함하지 않습니다.
