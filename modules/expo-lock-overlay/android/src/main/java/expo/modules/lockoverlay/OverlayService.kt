package expo.modules.lockoverlay

import android.app.Service
import android.content.Intent
import android.graphics.PixelFormat
import android.os.Build
import android.os.IBinder
import android.view.*
import android.widget.FrameLayout

class OverlayService : Service() {

  private var windowManager: WindowManager? = null
  private var overlayView: View? = null

  override fun onCreate() {
    super.onCreate()
      android.util.Log.d("OVERLAY", "OverlayService started")

    showOverlay()
  }

  @Suppress("DEPRECATION")
  private fun showOverlay() {
    windowManager = getSystemService(WINDOW_SERVICE) as WindowManager

    overlayView = FrameLayout(this).apply {
      setBackgroundColor(0xFF000000.toInt())
      isClickable = true
      isFocusable = true
    }

    val params = WindowManager.LayoutParams(
      WindowManager.LayoutParams.MATCH_PARENT,
      WindowManager.LayoutParams.MATCH_PARENT,
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
        WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
      else
        WindowManager.LayoutParams.TYPE_PHONE,
      WindowManager.LayoutParams.FLAG_FULLSCREEN or
      WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
      PixelFormat.OPAQUE
    )

    windowManager?.addView(overlayView, params)
  }

  override fun onDestroy() {
    overlayView?.let { windowManager?.removeView(it) }
    overlayView = null
    super.onDestroy()
  }

  override fun onBind(intent: Intent?): IBinder? = null
}
