package expo.modules.timelimit

import android.app.*
import android.content.Intent
import android.os.CountDownTimer
import android.os.IBinder
import android.util.Log

class TimeLimitService : Service() {

    // THIS IS THE "MAILBOX"
    // Everything inside here can be seen by the Module
    companion object {
        var lastKnownSeconds: Int = 0
    }

    private var timer: CountDownTimer? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val seconds = intent?.getIntExtra("SECONDS", 0) ?: 0
        
        // Initialize the shared variable immediately
        lastKnownSeconds = seconds

        showNotification()
        startCountdown(seconds)

        return START_NOT_STICKY
    }

    private fun startCountdown(seconds: Int) {
        timer?.cancel()

        timer = object : CountDownTimer(seconds * 1000L, 1000L) {
            override fun onTick(millisUntilFinished: Long) {
                val currentSeconds = (millisUntilFinished / 1000).toInt()
                
                // UPDATE THE SHARED MAILBOX EVERY SECOND
                lastKnownSeconds = currentSeconds
                
                Log.d("KiddoGuard", "Ticks left: $currentSeconds")
            }

            override fun onFinish() {
                lastKnownSeconds = 0
                val signalIntent = Intent("EXPO_TIME_LIMIT_EXPIRED")
                sendBroadcast(signalIntent)
                stopSelf()
            }
        }.start()
    }

    private fun showNotification() {
        val channelId = "kiddoguard_timer"
        val channel = NotificationChannel(channelId, "Monitor", NotificationManager.IMPORTANCE_LOW)
        val manager = getSystemService(NotificationManager::class.java)
        manager.createNotificationChannel(channel)

        val notification = Notification.Builder(this, channelId)
            .setContentTitle("KiddoGuard Active")
            .setContentText("Monitoring screen time...")
            .setSmallIcon(android.R.drawable.ic_lock_idle_lock)
            .setOngoing(true)
            .build()

        startForeground(1, notification)
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        timer?.cancel()
        super.onDestroy()
    }
}