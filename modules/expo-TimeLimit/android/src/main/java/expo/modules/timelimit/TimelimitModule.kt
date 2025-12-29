package expo.modules.timelimit

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class TimelimitModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("Timelimit")

    Events("onTimeExpired")

    // 1. Start Countdown
    AsyncFunction("startCountdown") { seconds: Int ->
        val context = appContext.reactContext ?: return@AsyncFunction false
        val intent = Intent(context, TimeLimitService::class.java).apply {
            putExtra("SECONDS", seconds)
        }
        context.startForegroundService(intent)
        true
    }

    // 2. Stop Countdown & Get Remaining Time
    AsyncFunction("stopCountdown") {
        val remaining = TimeLimitService.lastKnownSeconds
        
        val context = appContext.reactContext ?: return@AsyncFunction 0
        val intent = Intent(context, TimeLimitService::class.java)
        context.stopService(intent)
        
        return@AsyncFunction remaining
    }
    
    // 3. The Listener for "Time's Up"
    OnCreate {
        val context = appContext.reactContext ?: return@OnCreate
        val filter = IntentFilter("EXPO_TIME_LIMIT_EXPIRED")
        
        val receiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context?, intent: Intent?) {
                // We use this@TimelimitModule to tell Kotlin 
                // which class is sending the event
                this@TimelimitModule.sendEvent("onTimeExpired")
            }
        }
        
        // Register the receiver so it hears the service "flare"
        context.registerReceiver(receiver, filter, Context.RECEIVER_EXPORTED)
    }
  }
}