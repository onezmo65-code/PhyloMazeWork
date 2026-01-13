# RevenueCat Integration Guide for Nebula Maze (iOS/SwiftUI)

This guide helps you integrate the RevenueCat SDK into your iOS SwiftUI project using Swift Package Manager.

## 1. Install RevenueCat SDK

1. Open your project in Xcode.
2. Go to **File > Add Packages...**
3. Enter the package URL: `https://github.com/RevenueCat/purchases-ios-spm.git`
4. Click **Add Package**.
5. Select `RevenueCat` and `RevenueCatUI` libraries.

## 2. Configure SDK

In your main app file (e.g., `NebulaMazeApp.swift`), configure the SDK with your API key.

```swift
import SwiftUI
import RevenueCat

@main
struct NebulaMazeApp: App {
    init() {
        // Configure RevenueCat with your API Key
        Purchases.configure(withAPIKey: "test_BlUxAlKBmWzQdTWPveJVbrqXKWe")
        
        // Optional: Enable debug logs level
        Purchases.logLevel = .debug
    }
    
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

## 3. Create a Subscription Manager

Create a `SubscriptionManager.swift` to handle logic.

```swift
import Foundation
import RevenueCat

class SubscriptionManager: ObservableObject {
    static let shared = SubscriptionManager()
    
    @Published var isPro = false
    
    init() {
        checkEntitlement()
    }
    
    func checkEntitlement() {
        Purchases.shared.getCustomerInfo { (customerInfo, error) in
            if let info = customerInfo {
                // Check for "Nebula Maze Pro" entitlement
                if info.entitlements.all["Nebula Maze Pro"]?.isActive == true {
                    DispatchQueue.main.async {
                        self.isPro = true
                    }
                } else {
                    DispatchQueue.main.async {
                        self.isPro = false
                    }
                }
            }
        }
    }
}
```

## 4. Implement Paywall

You can use RevenueCat's Paywall UI for a quick setup.

```swift
import SwiftUI
import RevenueCatUI

struct PaywallContainerView: View {
    var body: some View {
        PaywallView(displayCloseButton: true)
            .onPurchaseCompleted { customerInfo in
                print("Purchase completed: \(customerInfo.entitlements)")
                SubscriptionManager.shared.checkEntitlement()
            }
            .onRestoreCompleted { customerInfo in
                print("Restore completed: \(customerInfo.entitlements)")
                SubscriptionManager.shared.checkEntitlement()
            }
    }
}
```

## 5. Usage in ContentView

```swift
import SwiftUI
import RevenueCatUI

struct ContentView: View {
    @StateObject var subManager = SubscriptionManager.shared
    @State private var showPaywall = false
    
    var body: some View {
        VStack {
            if subManager.isPro {
                Text("Welcome Pro User!")
                    .font(.largeTitle)
                    .foregroundColor(.green)
            } else {
                Text("Free Version")
                Button("Upgrade to Pro") {
                    showPaywall = true
                }
                .padding()
                .background(Color.blue)
                .foregroundColor(.white)
                .cornerRadius(10)
            }
        }
        .sheet(isPresented: $showPaywall) {
            PaywallContainerView()
        }
    }
}
```

## 6. Product Configuration (RevenueCat Dashboard)

Ensure you have configured the following in the RevenueCat Dashboard:

1.  **Entitlements**: Create an entitlement named `Nebula Maze Pro`.
2.  **Offerings**: Create a default Offering.
3.  **Packages**: Add the following packages to your Offering:
    *   `$rc_weekly` (Weekly)
    *   `$rc_monthly` (Monthly)
    *   `$rc_annual` (Yearly)
4.  **Products**: Map your App Store Connect product IDs to these packages.

## 7. Customer Center (Optional)

To allow users to manage their subscriptions:

```swift
import RevenueCatUI

struct SettingsView: View {
    @State private var showCustomerCenter = false
    
    var body: some View {
        Button("Manage Subscription") {
            showCustomerCenter = true
        }
        .sheet(isPresented: $showCustomerCenter) {
            CustomerCenterView()
        }
    }
}
```
