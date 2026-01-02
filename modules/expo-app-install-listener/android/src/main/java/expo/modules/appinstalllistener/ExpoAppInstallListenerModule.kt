package expo.modules.appinstalllistener

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoAppInstallListenerModule : Module() {
  private var receiver: BroadcastReceiver? = null

  override fun definition() = ModuleDefinition {
    Name("ExpoAppInstallListener")

    // 1. Register both event names for JS
    Events("onAppInstalled", "onAppRemoved")

    OnCreate {
      val filter = IntentFilter().apply {
          addAction(Intent.ACTION_PACKAGE_ADDED)
          addAction(Intent.ACTION_PACKAGE_REMOVED) // 2. Add the Remove action
          addDataScheme("package")
      }

      receiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
          val isReplacing = intent.getBooleanExtra(Intent.EXTRA_REPLACING, false)
          val packageName = intent.dataString?.replace("package:", "")
          
          if (packageName == null) return

          // 3. Handle logic based on action type
          when (intent.action) {
            Intent.ACTION_PACKAGE_ADDED -> {
              // Only fire if it's a fresh install, not an update
              if (!isReplacing) {
                sendEvent("onAppInstalled", mapOf("packageName" to packageName))
              }
            }
            Intent.ACTION_PACKAGE_REMOVED -> {
              // Only fire if it's a full uninstall, not part of an update/replace
              if (!isReplacing) {
                sendEvent("onAppRemoved", mapOf("packageName" to packageName))
              }
            }
          }
        }
      }

      appContext.reactContext?.registerReceiver(receiver, filter)
    }

    OnDestroy {
      receiver?.let {
        appContext.reactContext?.unregisterReceiver(it)
      }
    }
  }
}