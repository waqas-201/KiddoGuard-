package expo.modules.screencheck

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.view.WindowManager
import android.app.Activity
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoScreenCheckModule : Module() {
    private var screenReceiver: BroadcastReceiver? = null

    override fun definition() = ModuleDefinition {
        Name("ExpoScreenCheck")

        Events("onScreenState")

        // FUNCTION 1: Just go to the Home screen
        AsyncFunction("goToHome") {
            triggerHomeIntent()
            return@AsyncFunction null
        }

        // In ExpoScreenCheckModule.kt

AsyncFunction("resetLauncherStack") {
    val context = appContext.reactContext ?: return@AsyncFunction null
    val activity = appContext.currentActivity ?: return@AsyncFunction null

    // This tells Android: "Bring my launcher to the front and clear all other activities inside it"
    val intent = context.packageManager.getLaunchIntentForPackage(context.packageName)
    intent?.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP)
    context.startActivity(intent)

    return@AsyncFunction null
}

       

        // FUNCTION 3: Control the privacy overlay (Black screen in recents)
        Function("setSecureFlag") { enable: Boolean ->
            val activity = appContext.currentActivity ?: return@Function
            activity.runOnUiThread {
                if (enable) {
                    activity.window.addFlags(WindowManager.LayoutParams.FLAG_SECURE)
                } else {
                    activity.window.clearFlags(WindowManager.LayoutParams.FLAG_SECURE)
                }
            }
        }

        OnCreate {
            registerScreenReceiver()
        }

        OnDestroy {
            screenReceiver?.let {
                appContext.reactContext?.unregisterReceiver(it)
                screenReceiver = null
            }
        }
    }

    private fun triggerHomeIntent() {
        val context = appContext.reactContext ?: return
        val intent = Intent(Intent.ACTION_MAIN).apply {
            addCategory(Intent.CATEGORY_HOME)
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }
        context.startActivity(intent)
    }

    private fun registerScreenReceiver() {
        if (screenReceiver != null) return
        val context = appContext.reactContext ?: return

        screenReceiver = object : BroadcastReceiver() {
            override fun onReceive(ctx: Context?, intent: Intent?) {
                when (intent?.action) {
                    Intent.ACTION_SCREEN_OFF -> {
                        // By default, we still go home on Screen Off for safety
                        triggerHomeIntent()
                        sendEvent("onScreenState", mapOf("state" to "OFF"))
                    }
                    Intent.ACTION_SCREEN_ON -> {
                        sendEvent("onScreenState", mapOf("state" to "ON"))
                    }
                }
            }
        }

        val filter = IntentFilter().apply {
            addAction(Intent.ACTION_SCREEN_ON)
            addAction(Intent.ACTION_SCREEN_OFF)
        }
        context.registerReceiver(screenReceiver, filter)
    }
}