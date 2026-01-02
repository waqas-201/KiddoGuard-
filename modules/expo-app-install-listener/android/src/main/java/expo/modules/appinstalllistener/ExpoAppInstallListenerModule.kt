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

    // Define the event name JS will listen to
    Events("onAppInstalled")

    OnCreate {
      val filter = IntentFilter().apply {
        addAction(Intent.ACTION_PACKAGE_ADDED)
        addDataScheme("package")
      }

      receiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
          // ACTION_PACKAGE_ADDED fires for new installs and updates
          // EXTRA_REPLACING is true if it's just an update/reinstall
          val isReplacing = intent.getBooleanExtra(Intent.EXTRA_REPLACING, false)
          
          if (intent.action == Intent.ACTION_PACKAGE_ADDED && !isReplacing) {
            val packageName = intent.dataString?.replace("package:", "")
            packageName?.let {
              sendEvent("onAppInstalled", mapOf(
                "packageName" to it
              ))
            }
          }
        }
      }

      // Register the receiver dynamically
      appContext.reactContext?.registerReceiver(receiver, filter)
    }

    OnDestroy {
      receiver?.let {
        appContext.reactContext?.unregisterReceiver(it)
      }
    }
  }
}