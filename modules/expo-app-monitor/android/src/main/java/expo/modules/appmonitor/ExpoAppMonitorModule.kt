

// package expo.modules.appmonitor

// import android.accessibilityservice.AccessibilityService
// import android.view.accessibility.AccessibilityEvent
// import android.content.ComponentName
// import android.content.Intent
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

//     fun sendForegroundAppToJS(packageName: String) {
//         sendEvent("onChange", mapOf("value" to packageName))
//     }

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

//         AsyncFunction("setValueAsync") {
//             sendEvent("onChange", mapOf("value" to "Hello from native"))
//             "Event sent"
//         }

//         AsyncFunction("openAccessibilitySettings") {
//     val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS).apply {
//         flags = Intent.FLAG_ACTIVITY_NEW_TASK
//     }
//     appContext.reactContext?.startActivity(intent)
// }

       
//         AsyncFunction("isServiceEnabled") { isAppAccessibilityServiceEnabled() }
//     }
// }

// // Accessibility Service
// class KidAppAccessService : AccessibilityService() {

//     override fun onAccessibilityEvent(event: AccessibilityEvent?) {
//         event ?: return
//         if (event.eventType == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) {
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
import android.content.Intent
import android.provider.Settings
import android.text.TextUtils
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoAppMonitorModule : Module() {

    companion object {
        var instance: ExpoAppMonitorModule? = null
    }

    override fun definition() = ModuleDefinition {
        Name("ExpoAppMonitor")
        Events("onChange")

        OnCreate {
            instance = this@ExpoAppMonitorModule
        }

        AsyncFunction("isServiceEnabled") {
            val ctx = appContext.reactContext ?: return@AsyncFunction false
            val enabledServices = Settings.Secure.getString(
                ctx.contentResolver,
                Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
            )
            val expectedComponent = ComponentName(ctx, KidAppAccessService::class.java)
            val isEnabled = !TextUtils.isEmpty(enabledServices) && 
                            enabledServices.contains(expectedComponent.flattenToString())
            return@AsyncFunction isEnabled
        }

        AsyncFunction("openAccessibilitySettings") {
            val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            appContext.reactContext?.startActivity(intent)
            return@AsyncFunction null // Added return to fix "Unit" mismatch
        }

        AsyncFunction("bringAppToFront") {
            val context = appContext.reactContext ?: return@AsyncFunction null
            val intent = context.packageManager.getLaunchIntentForPackage(context.packageName)?.apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                addFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT)
                addFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION)
            }
            if (intent != null) {
                context.startActivity(intent)
            }
            return@AsyncFunction true // Added return to fix "Unit" mismatch
        }
    }

    fun sendForegroundAppToJS(packageName: String) {
        try {
            sendEvent("onChange", mapOf("value" to packageName))
        } catch (e: Exception) {
            // Bridge not ready
        }
    }
}

class KidAppAccessService : AccessibilityService() {
    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        val packageName = event?.packageName?.toString() ?: return
    
        if (event.eventType == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) {
            ExpoAppMonitorModule.instance?.sendForegroundAppToJS(packageName)
        }
    }

    override fun onInterrupt() {}

    override fun onDestroy() {
        super.onDestroy()
        ExpoAppMonitorModule.instance = null
    }
}