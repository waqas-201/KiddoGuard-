// package expo.modules.appmonitor

// import android.accessibilityservice.AccessibilityService
// import android.content.ComponentName
// import android.provider.Settings
// import android.text.TextUtils
// import expo.modules.kotlin.modules.Module
// import expo.modules.kotlin.modules.ModuleDefinition
// import java.util.Timer
// import java.util.TimerTask

// class ExpoAppMonitorModule : Module() {

//     companion object {
//         var instance: ExpoAppMonitorModule? = null
//     }

//     init { instance = this }

//     private var timer: Timer? = null

//     // Send the foreground app package name to JS
//     fun sendForegroundAppToJS(packageName: String) {
//         sendEvent("onChange", mapOf("value" to packageName))
//     }

//     // Check if this app's accessibility service is enabled
//     fun isAppAccessibilityServiceEnabled(): Boolean {
//         val ctx = appContext.reactContext ?: return false
//         val enabledServices = Settings.Secure.getString(
//             ctx.contentResolver,
//             Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
//         )
//         val expectedComponent = ComponentName(ctx, KidAppAccessService::class.java)
//         return !TextUtils.isEmpty(enabledServices) && enabledServices.contains(expectedComponent.flattenToString())
//     }

//     override fun definition() = ModuleDefinition {
//         Name("ExpoAppMonitor")
//         Events("onChange")

//         // Send test event
//         AsyncFunction("setValueAsync") {
//             sendEvent("onChange", mapOf("value" to "Hello from native"))
//             "Event sent"  // <-- return something
//         }

//         // Start a repeating timer to send events
//         AsyncFunction("startMonitoring") {
//             if (timer == null) {
//                 timer = Timer()
//                 timer?.scheduleAtFixedRate(object : TimerTask() {
//                     override fun run() {
//                         sendEvent("onChange", mapOf("value" to "tick_" + System.currentTimeMillis()))
//                     }
//                 }, 1000, 2000)
//             }
//             "Monitoring started"  // <-- return something
//         }

//         // Check if service is enabled
//         AsyncFunction("isServiceEnabled") { isAppAccessibilityServiceEnabled() }
//     }
// }

// // Accessibility Service
// class KidAppAccessService : AccessibilityService() {
//     override fun onAccessibilityEvent(event: android.view.accessibilityservice.AccessibilityEvent?) {
//         event ?: return
//         if (event.eventType == android.view.accessibilityservice.AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) {
//             val packageName = event.packageName?.toString() ?: "unknown"
//             ExpoAppMonitorModule.instance?.sendForegroundAppToJS(packageName)
//         }
//     }

//     override fun onInterrupt() {}
// }


package expo.modules.appmonitor

import android.accessibilityservice.AccessibilityService
import android.view.accessibility.AccessibilityEvent
import android.content.ComponentName
import android.provider.Settings
import android.text.TextUtils
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.util.Timer
import java.util.TimerTask

class ExpoAppMonitorModule : Module() {

    companion object {
        var instance: ExpoAppMonitorModule? = null
    }

    init { instance = this }

    private var timer: Timer? = null

    fun sendForegroundAppToJS(packageName: String) {
        sendEvent("onChange", mapOf("value" to packageName))
    }

    fun isAppAccessibilityServiceEnabled(): Boolean {
        val ctx = appContext.reactContext ?: return false
        val enabledServices = Settings.Secure.getString(
            ctx.contentResolver,
            Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
        )
        val expectedComponent = ComponentName(ctx, KidAppAccessService::class.java)
        return !TextUtils.isEmpty(enabledServices) && enabledServices.contains(expectedComponent.flattenToString())
    }

    override fun definition() = ModuleDefinition {
        Name("ExpoAppMonitor")
        Events("onChange")

        AsyncFunction("setValueAsync") {
            sendEvent("onChange", mapOf("value" to "Hello from native"))
            "Event sent"
        }

       
        AsyncFunction("isServiceEnabled") { isAppAccessibilityServiceEnabled() }
    }
}

// Accessibility Service
class KidAppAccessService : AccessibilityService() {

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        event ?: return
        if (event.eventType == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) {
            val packageName = event.packageName?.toString() ?: "unknown"
            ExpoAppMonitorModule.instance?.sendForegroundAppToJS(packageName)
        }
    }

    override fun onInterrupt() {}
}
