import Foundation
import SwiftUI

@MainActor
final class NouAeStore: ObservableObject {
    @Published var state: NouAeState {
        didSet { save() }
    }

    private let fileName = "nouae-state.json"
    private let encoder = JSONEncoder()
    private let decoder = JSONDecoder()

    init(seedSampleData: Bool = true) {
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
        encoder.dateEncodingStrategy = .iso8601
        decoder.dateDecodingStrategy = .iso8601

        if let loadedState = Self.load(fileName: fileName, decoder: decoder) {
            self.state = loadedState
        } else {
            self.state = seedSampleData ? .sample : .empty
            save()
        }
    }

    var todayTasks: [TaskItem] {
        state.tasks.filter { task in
            if task.section == "today" { return true }
            if let dueDate = task.dueDate {
                return Calendar.current.isDateInToday(dueDate)
            }
            return false
        }
    }

    var inboxTasks: [TaskItem] {
        state.tasks.filter { $0.section == "inbox" && !$0.isDone }
    }

    var doneTasks: [TaskItem] {
        state.tasks.filter(\.isDone)
    }

    var completionRate: Double {
        guard state.tasks.isEmpty == false else { return 0 }
        return Double(doneTasks.count) / Double(state.tasks.count)
    }

    func addInboxTask(title: String, note: String = "") {
        let trimmed = title.trimmingCharacters(in: .whitespacesAndNewlines)
        guard trimmed.isEmpty == false else { return }
        state.tasks.insert(TaskItem(title: trimmed, note: note, section: "inbox"), at: 0)
    }

    func addTodayTask(title: String, projectId: UUID? = nil) {
        let trimmed = title.trimmingCharacters(in: .whitespacesAndNewlines)
        guard trimmed.isEmpty == false else { return }
        state.tasks.insert(TaskItem(title: trimmed, section: "today", projectId: projectId, dueDate: Date()), at: 0)
    }

    func toggleTask(_ task: TaskItem) {
        guard let index = state.tasks.firstIndex(where: { $0.id == task.id }) else { return }
        state.tasks[index].isDone.toggle()
    }

    func moveTaskToToday(_ task: TaskItem) {
        guard let index = state.tasks.firstIndex(where: { $0.id == task.id }) else { return }
        state.tasks[index].section = "today"
        state.tasks[index].dueDate = Date()
    }

    func deleteTask(_ task: TaskItem) {
        state.tasks.removeAll { $0.id == task.id }
    }

    func addProject(name: String, goal: String = "") {
        let trimmed = name.trimmingCharacters(in: .whitespacesAndNewlines)
        guard trimmed.isEmpty == false else { return }
        state.projects.insert(Project(name: trimmed, goal: goal), at: 0)
    }

    func toggleChecklist(project: Project, item: ChecklistItem) {
        guard let projectIndex = state.projects.firstIndex(where: { $0.id == project.id }) else { return }
        guard let itemIndex = state.projects[projectIndex].checklist.firstIndex(where: { $0.id == item.id }) else { return }
        state.projects[projectIndex].checklist[itemIndex].isDone.toggle()
    }

    func addChecklistItem(project: Project, title: String) {
        let trimmed = title.trimmingCharacters(in: .whitespacesAndNewlines)
        guard trimmed.isEmpty == false else { return }
        guard let projectIndex = state.projects.firstIndex(where: { $0.id == project.id }) else { return }
        state.projects[projectIndex].checklist.append(ChecklistItem(title: trimmed))
    }

    func addMood(label: String, intensity: Int, note: String = "") {
        let safeIntensity = min(max(intensity, 1), 5)
        let colorHex: String
        switch safeIntensity {
        case 1: colorHex = "#8D99AE"
        case 2: colorHex = "#A8DADC"
        case 3: colorHex = "#FFD166"
        case 4: colorHex = "#06D6A0"
        default: colorHex = "#EF476F"
        }
        state.moodEntries.insert(MoodEntry(label: label, intensity: safeIntensity, colorHex: colorHex, note: note), at: 0)
    }

    func resetToSample() {
        state = .sample
    }

    private func save() {
        do {
            let data = try encoder.encode(state)
            try data.write(to: fileURL(), options: [.atomic])
        } catch {
            print("NouAeStore save error: \(error.localizedDescription)")
        }
    }

    private static func load(fileName: String, decoder: JSONDecoder) -> NouAeState? {
        do {
            let documentsURL = try FileManager.default.url(
                for: .documentDirectory,
                in: .userDomainMask,
                appropriateFor: nil,
                create: true
            )
            let url = documentsURL.appendingPathComponent(fileName)
            guard FileManager.default.fileExists(atPath: url.path) else { return nil }
            let data = try Data(contentsOf: url)
            return try decoder.decode(NouAeState.self, from: data)
        } catch {
            print("NouAeStore load error: \(error.localizedDescription)")
            return nil
        }
    }

    private func fileURL() throws -> URL {
        let documentsURL = try FileManager.default.url(
            for: .documentDirectory,
            in: .userDomainMask,
            appropriateFor: nil,
            create: true
        )
        return documentsURL.appendingPathComponent(fileName)
    }
}
