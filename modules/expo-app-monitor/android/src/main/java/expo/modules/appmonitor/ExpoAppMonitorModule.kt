

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
