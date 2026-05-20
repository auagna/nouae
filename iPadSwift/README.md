# nou ae iPad SwiftUI MVP

이 폴더는 iPad에서 `nou ae`를 SwiftUI로 빠르게 테스트하기 위한 초기 MVP 파일 세트입니다.

## 현재 포함 기능

- iPad용 `NavigationSplitView` 기반 사이드바 레이아웃
- Home / Today / Inbox / Projects / Timeline / Mood / Focus 섹션
- Recents 사이드바 그룹
- 프로젝트별 체크리스트 및 진행률
- Today / Inbox 작업 추가 및 완료 처리
- Mood 강도 기록
- Focus 타이머
- 로컬 JSON 저장소 기반 데이터 저장

## 파일 구성

```text
iPadSwift/
├── NouAeApp.swift
├── NouAeModels.swift
├── NouAeStore.swift
├── NouAeRootView.swift
└── README.md
```

## iPad Swift Playgrounds에서 사용하는 방법

1. Swift Playgrounds에서 새 App 프로젝트를 만듭니다.
2. 기본 `ContentView.swift`와 `App.swift` 내용을 교체하거나 새 파일로 추가합니다.
3. 이 폴더의 Swift 파일 4개를 프로젝트에 넣습니다.
4. 기존 `@main` App 구조가 있으면 `NouAeApp.swift`와 중복되지 않게 하나만 남깁니다.
5. 실행 후 샘플 데이터가 뜨는지 확인합니다.

## Xcode에서 사용하는 방법

1. 새 iPadOS App 프로젝트를 생성합니다.
2. Deployment Target은 iPadOS 16 이상을 권장합니다.
3. `iPadSwift` 폴더의 Swift 파일을 앱 타깃에 추가합니다.
4. 빌드 후 사이드바, Today, Projects, Mood, Focus 화면을 확인합니다.

## MVP 판단

초기에는 iCloud, 로그인, 협업, AI 자동 생성 기능을 넣지 않습니다. 먼저 개인용 로컬 앱으로 `수집 → 오늘 배치 → 프로젝트 체크 → 기록 → 루프 닫기`가 작동해야 합니다.

## 다음 개발 단계

1. `ContentView` 분리 및 화면별 파일 분리
2. 프로젝트 수정/삭제 기능 추가
3. 운동 기록 전용 모델 추가
4. 식단/칼로리 기록 모델 추가
5. Calendar 스타일 주간 뷰 추가
6. SwiftData 또는 iCloud 연동 검토
