import SwiftUI

@main
struct NouAeApp: App {
    @StateObject private var store = NouAeStore()

    var body: some Scene {
        WindowGroup {
            NouAeRootView()
                .environmentObject(store)
        }
    }
}
