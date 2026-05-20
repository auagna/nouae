import SwiftUI

struct NouAeRootView: View {
    @EnvironmentObject private var store: NouAeStore
    @State private var selectedSection: AppSection? = .home
    @State private var selectedProjectId: UUID?
    @State private var isSidebarVisible = true

    var body: some View {
        NavigationSplitView {
            SidebarView(
                selectedSection: $selectedSection,
                selectedProjectId: $selectedProjectId,
                isSidebarVisible: $isSidebarVisible
            )
            .navigationTitle("nou ae")
        } detail: {
            Group {
                if let selectedProjectId,
                   let project = store.state.projects.first(where: { $0.id == selectedProjectId }) {
                    ProjectDetailView(project: project)
                } else {
                    sectionView
                }
            }
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("샘플 초기화") {
                        store.resetToSample()
                    }
                }
            }
        }
    }

    @ViewBuilder
    private var sectionView: some View {
        switch selectedSection ?? .home {
        case .home:
            HomeDashboardView()
        case .today:
            TodayView()
        case .inbox:
            InboxView()
        case .projects:
            ProjectsView(selectedProjectId: $selectedProjectId)
        case .timeline:
            TimelineView()
        case .mood:
            MoodView()
        case .focus:
            FocusTimerView()
        }
    }
}

struct SidebarView: View {
    @EnvironmentObject private var store: NouAeStore
    @Binding var selectedSection: AppSection?
    @Binding var selectedProjectId: UUID?
    @Binding var isSidebarVisible: Bool

    var body: some View {
        List(selection: $selectedSection) {
            Section("System") {
                ForEach(AppSection.allCases) { section in
                    Button {
                        selectedProjectId = nil
                        selectedSection = section
                    } label: {
                        Label(section.title, systemImage: section.symbol)
                    }
                    .tag(section as AppSection?)
                }
            }

            Section("Recents") {
                ForEach(store.state.tasks.prefix(4)) { task in
                    Label(task.title, systemImage: task.isDone ? "checkmark.circle" : "circle")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }
            }

            Section("Projects") {
                ForEach(store.state.projects) { project in
                    Button {
                        selectedSection = .projects
                        selectedProjectId = project.id
                    } label: {
                        Label(project.name, systemImage: project.icon)
                    }
                }
            }
        }
        .listStyle(.sidebar)
    }
}

struct HomeDashboardView: View {
    @EnvironmentObject private var store: NouAeStore

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                PageHeader(title: "Home", subtitle: "오늘의 루프를 닫는 개인 작업대")

                LazyVGrid(columns: [GridItem(.adaptive(minimum: 220), spacing: 16)], spacing: 16) {
                    MetricCard(title: "Today", value: "\(store.todayTasks.count)", caption: "오늘 처리할 일")
                    MetricCard(title: "Inbox", value: "\(store.inboxTasks.count)", caption: "정리 대기")
                    MetricCard(title: "Projects", value: "\(store.state.projects.count)", caption: "운영 중")
                    MetricCard(title: "Done", value: "\(Int(store.completionRate * 100))%", caption: "전체 완료율")
                }

                DashboardSection(title: "Today Loop") {
                    VStack(spacing: 10) {
                        ForEach(store.todayTasks.prefix(5)) { task in
                            TaskRow(task: task)
                        }
                        if store.todayTasks.isEmpty {
                            EmptyStateView(title: "오늘 할 일이 비어있음", message: "Inbox에서 오늘로 보내거나 새 작업을 추가하세요.")
                        }
                    }
                }

                DashboardSection(title: "Project Progress") {
                    VStack(spacing: 12) {
                        ForEach(store.state.projects) { project in
                            ProjectProgressRow(project: project)
                        }
                    }
                }
            }
            .padding(24)
        }
        .background(Color(.systemGroupedBackground))
    }
}

struct TodayView: View {
    @EnvironmentObject private var store: NouAeStore
    @State private var newTaskTitle = ""

    var body: some View {
        VStack(alignment: .leading, spacing: 18) {
            PageHeader(title: "Today", subtitle: "오늘 닫아야 하는 최소 단위")

            HStack {
                TextField("오늘 할 일 추가", text: $newTaskTitle)
                    .textFieldStyle(.roundedBorder)
                Button("추가") {
                    store.addTodayTask(title: newTaskTitle)
                    newTaskTitle = ""
                }
                .buttonStyle(.borderedProminent)
            }

            List {
                ForEach(store.todayTasks) { task in
                    TaskRow(task: task)
                }
            }
            .listStyle(.plain)
        }
        .padding(24)
        .background(Color(.systemGroupedBackground))
    }
}

struct InboxView: View {
    @EnvironmentObject private var store: NouAeStore
    @State private var newTaskTitle = ""

    var body: some View {
        VStack(alignment: .leading, spacing: 18) {
            PageHeader(title: "Inbox", subtitle: "판단하지 말고 먼저 수집하는 공간")

            HStack {
                TextField("떠오른 일, 아이디어, 메모", text: $newTaskTitle)
                    .textFieldStyle(.roundedBorder)
                Button("수집") {
                    store.addInboxTask(title: newTaskTitle)
                    newTaskTitle = ""
                }
                .buttonStyle(.borderedProminent)
            }

            List {
                ForEach(store.inboxTasks) { task in
                    HStack {
                        TaskRow(task: task)
                        Spacer()
                        Button("Today") {
                            store.moveTaskToToday(task)
                        }
                        .buttonStyle(.bordered)
                    }
                }
            }
            .listStyle(.plain)
        }
        .padding(24)
        .background(Color(.systemGroupedBackground))
    }
}

struct ProjectsView: View {
    @EnvironmentObject private var store: NouAeStore
    @Binding var selectedProjectId: UUID?
    @State private var newProjectName = ""

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 18) {
                PageHeader(title: "Projects", subtitle: "운동, 디자인, 1일1프로그램처럼 반복되는 프로젝트를 관리")

                HStack {
                    TextField("프로젝트 이름", text: $newProjectName)
                        .textFieldStyle(.roundedBorder)
                    Button("프로젝트 추가") {
                        store.addProject(name: newProjectName)
                        newProjectName = ""
                    }
                    .buttonStyle(.borderedProminent)
                }

                LazyVGrid(columns: [GridItem(.adaptive(minimum: 280), spacing: 16)], spacing: 16) {
                    ForEach(store.state.projects) { project in
                        Button {
                            selectedProjectId = project.id
                        } label: {
                            ProjectCard(project: project)
                        }
                        .buttonStyle(.plain)
                    }
                }
            }
            .padding(24)
        }
        .background(Color(.systemGroupedBackground))
    }
}

struct ProjectDetailView: View {
    @EnvironmentObject private var store: NouAeStore
    let project: Project
    @State private var newChecklistTitle = ""

    var liveProject: Project {
        store.state.projects.first(where: { $0.id == project.id }) ?? project
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                PageHeader(title: liveProject.name, subtitle: liveProject.goal.isEmpty ? "프로젝트 상세" : liveProject.goal)

                ProjectProgressRow(project: liveProject)

                HStack {
                    TextField("체크 항목 추가", text: $newChecklistTitle)
                        .textFieldStyle(.roundedBorder)
                    Button("추가") {
                        store.addChecklistItem(project: liveProject, title: newChecklistTitle)
                        newChecklistTitle = ""
                    }
                    .buttonStyle(.borderedProminent)
                }

                DashboardSection(title: "Checklist") {
                    VStack(spacing: 8) {
                        ForEach(liveProject.checklist) { item in
                            Button {
                                store.toggleChecklist(project: liveProject, item: item)
                            } label: {
                                HStack {
                                    Image(systemName: item.isDone ? "checkmark.circle.fill" : "circle")
                                    Text(item.title)
                                    Spacer()
                                }
                                .padding(12)
                                .background(Color(.secondarySystemGroupedBackground))
                                .clipShape(RoundedRectangle(cornerRadius: 14))
                            }
                            .buttonStyle(.plain)
                        }
                    }
                }
            }
            .padding(24)
        }
        .background(Color(.systemGroupedBackground))
    }
}

struct TimelineView: View {
    @EnvironmentObject private var store: NouAeStore

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 18) {
                PageHeader(title: "Timeline", subtitle: "하루를 시간 블록으로 바라보기")

                ForEach(store.state.timeBlocks) { block in
                    HStack(alignment: .top, spacing: 16) {
                        VStack(alignment: .leading) {
                            Text(block.start.shortTimeText)
                            Text(block.end.shortTimeText)
                        }
                        .font(.caption)
                        .foregroundStyle(.secondary)
                        .frame(width: 70, alignment: .leading)

                        VStack(alignment: .leading, spacing: 6) {
                            Text(block.title)
                                .font(.headline)
                            Text(block.category.uppercased())
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                        Spacer()
                    }
                    .padding(16)
                    .background(Color(.secondarySystemGroupedBackground))
                    .clipShape(RoundedRectangle(cornerRadius: 18))
                }
            }
            .padding(24)
        }
        .background(Color(.systemGroupedBackground))
    }
}

struct MoodView: View {
    @EnvironmentObject private var store: NouAeStore
    @State private var label = "집중"
    @State private var intensity = 3
    @State private var note = ""

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 18) {
                PageHeader(title: "Mood", subtitle: "감정 강도를 기록하고 색으로 남기기")

                VStack(alignment: .leading, spacing: 12) {
                    TextField("감정 라벨", text: $label)
                        .textFieldStyle(.roundedBorder)
                    Stepper("강도: \(intensity)", value: $intensity, in: 1...5)
                    TextField("메모", text: $note)
                        .textFieldStyle(.roundedBorder)
                    Button("감정 기록") {
                        store.addMood(label: label, intensity: intensity, note: note)
                        note = ""
                    }
                    .buttonStyle(.borderedProminent)
                }
                .padding(16)
                .background(Color(.secondarySystemGroupedBackground))
                .clipShape(RoundedRectangle(cornerRadius: 18))

                LazyVGrid(columns: [GridItem(.adaptive(minimum: 160), spacing: 12)], spacing: 12) {
                    ForEach(store.state.moodEntries) { mood in
                        VStack(alignment: .leading, spacing: 10) {
                            Circle()
                                .fill(Color(hex: mood.colorHex))
                                .frame(width: 34, height: 34)
                            Text(mood.label)
                                .font(.headline)
                            Text("강도 \(mood.intensity) · \(mood.date.shortDayText)")
                                .font(.caption)
                                .foregroundStyle(.secondary)
                            if mood.note.isEmpty == false {
                                Text(mood.note)
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(16)
                        .background(Color(.secondarySystemGroupedBackground))
                        .clipShape(RoundedRectangle(cornerRadius: 18))
                    }
                }
            }
            .padding(24)
        }
        .background(Color(.systemGroupedBackground))
    }
}

struct FocusTimerView: View {
    @State private var remainingSeconds = 25 * 60
    @State private var isRunning = false
    @State private var timer: Timer?

    var body: some View {
        VStack(spacing: 24) {
            PageHeader(title: "Focus", subtitle: "작은 단위로 몰입을 시작")

            Text(timeText)
                .font(.system(size: 72, weight: .bold, design: .rounded))
                .monospacedDigit()

            HStack(spacing: 12) {
                Button(isRunning ? "일시정지" : "시작") {
                    isRunning ? pause() : start()
                }
                .buttonStyle(.borderedProminent)

                Button("25분") {
                    set(minutes: 25)
                }
                .buttonStyle(.bordered)

                Button("50분") {
                    set(minutes: 50)
                }
                .buttonStyle(.bordered)

                Button("초기화") {
                    reset()
                }
                .buttonStyle(.bordered)
            }
        }
        .padding(24)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color(.systemGroupedBackground))
        .onDisappear { pause() }
    }

    private var timeText: String {
        let minutes = remainingSeconds / 60
        let seconds = remainingSeconds % 60
        return String(format: "%02d:%02d", minutes, seconds)
    }

    private func start() {
        guard timer == nil else { return }
        isRunning = true
        timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { _ in
            if remainingSeconds > 0 {
                remainingSeconds -= 1
            } else {
                pause()
            }
        }
    }

    private func pause() {
        isRunning = false
        timer?.invalidate()
        timer = nil
    }

    private func reset() {
        pause()
        remainingSeconds = 25 * 60
    }

    private func set(minutes: Int) {
        pause()
        remainingSeconds = minutes * 60
    }
}

struct TaskRow: View {
    @EnvironmentObject private var store: NouAeStore
    let task: TaskItem

    var body: some View {
        Button {
            store.toggleTask(task)
        } label: {
            HStack(spacing: 12) {
                Image(systemName: task.isDone ? "checkmark.circle.fill" : "circle")
                    .foregroundStyle(task.isDone ? .green : .secondary)
                VStack(alignment: .leading, spacing: 4) {
                    Text(task.title)
                        .font(.body)
                        .strikethrough(task.isDone)
                    if task.note.isEmpty == false {
                        Text(task.note)
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                }
                Spacer()
            }
            .padding(12)
            .background(Color(.secondarySystemGroupedBackground))
            .clipShape(RoundedRectangle(cornerRadius: 14))
        }
        .buttonStyle(.plain)
    }
}

struct ProjectCard: View {
    let project: Project

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack {
                Image(systemName: project.icon)
                    .font(.title3)
                    .foregroundStyle(Color(hex: project.colorHex))
                Spacer()
                Text(project.progressText)
                    .font(.caption.weight(.semibold))
                    .foregroundStyle(.secondary)
            }
            Text(project.name)
                .font(.title3.weight(.bold))
            Text(project.goal.isEmpty ? "목표를 입력하세요." : project.goal)
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .lineLimit(2)
            ProgressView(value: project.progress)
        }
        .padding(18)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(.secondarySystemGroupedBackground))
        .clipShape(RoundedRectangle(cornerRadius: 22))
    }
}

struct ProjectProgressRow: View {
    let project: Project

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Label(project.name, systemImage: project.icon)
                    .font(.headline)
                Spacer()
                Text(project.progressText)
                    .font(.caption.weight(.semibold))
                    .foregroundStyle(.secondary)
            }
            ProgressView(value: project.progress)
                .tint(Color(hex: project.colorHex))
        }
        .padding(14)
        .background(Color(.secondarySystemGroupedBackground))
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }
}

struct PageHeader: View {
    let title: String
    let subtitle: String

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title)
                .font(.largeTitle.weight(.bold))
            Text(subtitle)
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

struct MetricCard: View {
    let title: String
    let value: String
    let caption: String

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .font(.caption.weight(.semibold))
                .foregroundStyle(.secondary)
            Text(value)
                .font(.system(size: 34, weight: .bold, design: .rounded))
            Text(caption)
                .font(.caption)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(18)
        .background(Color(.secondarySystemGroupedBackground))
        .clipShape(RoundedRectangle(cornerRadius: 22))
    }
}

struct DashboardSection<Content: View>: View {
    let title: String
    @ViewBuilder let content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(title)
                .font(.title3.weight(.bold))
            content
        }
    }
}

struct EmptyStateView: View {
    let title: String
    let message: String

    var body: some View {
        VStack(spacing: 8) {
            Text(title)
                .font(.headline)
            Text(message)
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding(28)
        .background(Color(.secondarySystemGroupedBackground))
        .clipShape(RoundedRectangle(cornerRadius: 18))
    }
}

#Preview {
    NouAeRootView()
        .environmentObject(NouAeStore())
}
