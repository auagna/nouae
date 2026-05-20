import Foundation
import SwiftUI

enum AppSection: String, CaseIterable, Identifiable, Codable {
    case home
    case today
    case inbox
    case projects
    case timeline
    case mood
    case focus

    var id: String { rawValue }

    var title: String {
        switch self {
        case .home: return "Home"
        case .today: return "Today"
        case .inbox: return "Inbox"
        case .projects: return "Projects"
        case .timeline: return "Timeline"
        case .mood: return "Mood"
        case .focus: return "Focus"
        }
    }

    var subtitle: String {
        switch self {
        case .home: return "전체 상태"
        case .today: return "오늘 해야 할 일"
        case .inbox: return "빠른 수집함"
        case .projects: return "프로젝트 관리"
        case .timeline: return "시간 블록"
        case .mood: return "감정 기록"
        case .focus: return "집중 타이머"
        }
    }

    var symbol: String {
        switch self {
        case .home: return "square.grid.2x2"
        case .today: return "sun.max"
        case .inbox: return "tray"
        case .projects: return "folder"
        case .timeline: return "calendar"
        case .mood: return "circle.hexagongrid"
        case .focus: return "timer"
        }
    }
}

struct TaskItem: Identifiable, Codable, Equatable {
    var id: UUID
    var title: String
    var note: String
    var section: String
    var projectId: UUID?
    var dueDate: Date?
    var isDone: Bool
    var createdAt: Date

    init(
        id: UUID = UUID(),
        title: String,
        note: String = "",
        section: String = "inbox",
        projectId: UUID? = nil,
        dueDate: Date? = nil,
        isDone: Bool = false,
        createdAt: Date = Date()
    ) {
        self.id = id
        self.title = title
        self.note = note
        self.section = section
        self.projectId = projectId
        self.dueDate = dueDate
        self.isDone = isDone
        self.createdAt = createdAt
    }
}

struct ChecklistItem: Identifiable, Codable, Equatable {
    var id: UUID
    var title: String
    var isDone: Bool

    init(id: UUID = UUID(), title: String, isDone: Bool = false) {
        self.id = id
        self.title = title
        self.isDone = isDone
    }
}

struct Project: Identifiable, Codable, Equatable {
    var id: UUID
    var name: String
    var icon: String
    var colorHex: String
    var goal: String
    var checklist: [ChecklistItem]
    var createdAt: Date

    init(
        id: UUID = UUID(),
        name: String,
        icon: String = "folder",
        colorHex: String = "#7A8CFF",
        goal: String = "",
        checklist: [ChecklistItem] = [],
        createdAt: Date = Date()
    ) {
        self.id = id
        self.name = name
        self.icon = icon
        self.colorHex = colorHex
        self.goal = goal
        self.checklist = checklist
        self.createdAt = createdAt
    }
}

extension Project {
    var progress: Double {
        guard checklist.isEmpty == false else { return 0 }
        let doneCount = checklist.filter(\.isDone).count
        return Double(doneCount) / Double(checklist.count)
    }

    var progressText: String {
        guard checklist.isEmpty == false else { return "0%" }
        return "\(Int(progress * 100))%"
    }
}

struct TimeBlock: Identifiable, Codable, Equatable {
    var id: UUID
    var title: String
    var start: Date
    var end: Date
    var category: String
    var note: String

    init(
        id: UUID = UUID(),
        title: String,
        start: Date,
        end: Date,
        category: String = "work",
        note: String = ""
    ) {
        self.id = id
        self.title = title
        self.start = start
        self.end = end
        self.category = category
        self.note = note
    }
}

struct MoodEntry: Identifiable, Codable, Equatable {
    var id: UUID
    var date: Date
    var label: String
    var intensity: Int
    var colorHex: String
    var note: String

    init(
        id: UUID = UUID(),
        date: Date = Date(),
        label: String,
        intensity: Int,
        colorHex: String = "#FFD166",
        note: String = ""
    ) {
        self.id = id
        self.date = date
        self.label = label
        self.intensity = intensity
        self.colorHex = colorHex
        self.note = note
    }
}

struct NouAeState: Codable, Equatable {
    var tasks: [TaskItem]
    var projects: [Project]
    var timeBlocks: [TimeBlock]
    var moodEntries: [MoodEntry]

    static var empty: NouAeState {
        NouAeState(tasks: [], projects: [], timeBlocks: [], moodEntries: [])
    }

    static var sample: NouAeState {
        let calendar = Calendar.current
        let today = Date()
        let evening = calendar.date(bySettingHour: 20, minute: 0, second: 0, of: today) ?? today
        let night = calendar.date(bySettingHour: 21, minute: 0, second: 0, of: today) ?? today
        let study = calendar.date(bySettingHour: 22, minute: 0, second: 0, of: today) ?? today
        let studyEnd = calendar.date(bySettingHour: 24, minute: 0, second: 0, of: today) ?? today

        let workout = Project(
            name: "운동",
            icon: "figure.run",
            colorHex: "#7A8CFF",
            goal: "러닝, 근력, 식단 기록을 하나의 루프로 유지한다.",
            checklist: [
                ChecklistItem(title: "러닝 3km"),
                ChecklistItem(title: "푸시업 100"),
                ChecklistItem(title: "풀업/밴드 100"),
                ChecklistItem(title: "코어 100"),
                ChecklistItem(title: "스쿼트 100")
            ]
        )

        let design = Project(
            name: "데일리 디자인",
            icon: "square.and.pencil",
            colorHex: "#EF476F",
            goal: "하루 하나의 관찰, 레퍼런스, 표현을 남긴다.",
            checklist: [
                ChecklistItem(title: "리서치"),
                ChecklistItem(title: "개념 설정"),
                ChecklistItem(title: "스케치"),
                ChecklistItem(title: "업로드")
            ]
        )

        return NouAeState(
            tasks: [
                TaskItem(title: "오늘 운동 기록 입력", section: "today", projectId: workout.id, dueDate: today),
                TaskItem(title: "nou ae iPad 구조 테스트", section: "today", projectId: nil, dueDate: today),
                TaskItem(title: "떠오른 아이디어 빠르게 적기", section: "inbox")
            ],
            projects: [workout, design],
            timeBlocks: [
                TimeBlock(title: "운동", start: evening, end: night, category: "body"),
                TimeBlock(title: "개인작업", start: night, end: study, category: "project"),
                TimeBlock(title: "공부", start: study, end: studyEnd, category: "study")
            ],
            moodEntries: [
                MoodEntry(label: "집중", intensity: 4, colorHex: "#06D6A0", note: "흐름을 다시 잡는 날")
            ]
        )
    }
}

extension Date {
    var shortDayText: String {
        formatted(.dateTime.month(.abbreviated).day().weekday(.abbreviated))
    }

    var shortTimeText: String {
        formatted(.dateTime.hour().minute())
    }
}

extension Color {
    init(hex: String) {
        let cleaned = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: cleaned).scanHexInt64(&int)

        let red: UInt64
        let green: UInt64
        let blue: UInt64

        switch cleaned.count {
        case 6:
            red = (int >> 16) & 0xFF
            green = (int >> 8) & 0xFF
            blue = int & 0xFF
        default:
            red = 122
            green = 140
            blue = 255
        }

        self.init(
            red: Double(red) / 255,
            green: Double(green) / 255,
            blue: Double(blue) / 255
        )
    }
}
