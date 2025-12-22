package expo.modules.screencheck

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.app.Activity
import android.os.Build
import android.provider.Settings
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoScreenCheckModule : Module() {

    private var screenReceiver: BroadcastReceiver? = null

    override fun definition() = ModuleDefinition {
        Name("ExpoScreenCheck")

        Events("onScreenState")

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

    private fun registerScreenReceiver() {
        if (screenReceiver != null) return

        val context = appContext.reactContext ?: return

        screenReceiver = object : BroadcastReceiver() {
            override fun onReceive(ctx: Context?, intent: Intent?) {
                when (intent?.action) {
                    Intent.ACTION_SCREEN_OFF ->
                        sendEvent("onScreenState", mapOf("state" to "OFF"))
                    Intent.ACTION_SCREEN_ON ->
                        sendEvent("onScreenState", mapOf("state" to "ON"))
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