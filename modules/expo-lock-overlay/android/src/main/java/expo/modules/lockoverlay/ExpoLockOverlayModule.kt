package expo.modules.lockoverlay

import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoLockOverlayModule : Module() {

  override fun definition() = ModuleDefinition {
    Name("ExpoLockOverlay")

    
Function("hasOverlayPermission") {
    val ctx = appContext.reactContext!!
    val can = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
        Settings.canDrawOverlays(ctx)
    } else true
    can
}

Function("openOverlaySettings") {
    val ctx = appContext.reactContext!!
    val pkg = ctx.packageName
    val intent = Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:$pkg"))
    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
    ctx.startActivity(intent)
    null
}

AsyncFunction("startOverlay") {
    val context = appContext.reactContext!!
    val intent = Intent(context, OverlayService::class.java)
    context.startService(intent)
}

AsyncFunction("stopOverlay") {
    val context = appContext.reactContext!!
    val intent = Intent(context, OverlayService::class.java)
    context.stopService(intent)
}

  }
}
