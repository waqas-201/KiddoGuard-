package expo.modules.installedapps

import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Bitmap.CompressFormat
import android.graphics.Canvas
import android.graphics.drawable.AdaptiveIconDrawable
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.util.Base64
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import org.json.JSONArray
import org.json.JSONObject
import java.io.ByteArrayOutputStream

class ExpoInstalledAppsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoInstalledApps")

    // Get all 3rd-party installed apps (system apps skipped)
    AsyncFunction("getInstalledApps") { promise: Promise ->
      try {
        val context = appContext.reactContext ?: throw Exception("Context is null")
        val pm: PackageManager = context.packageManager
        val packages = pm.getInstalledApplications(PackageManager.GET_META_DATA)
        val apps = JSONArray()

        for (appInfo in packages) {
          // Include only 3rd-party apps
          val isThirdParty = (appInfo.flags and ApplicationInfo.FLAG_SYSTEM) == 0 ||
                             (appInfo.flags and ApplicationInfo.FLAG_UPDATED_SYSTEM_APP) != 0
          if (!isThirdParty) continue

          val app = JSONObject().apply {
            put("packageName", appInfo.packageName)
            put("appName", appInfo.loadLabel(pm).toString())
          }

          apps.put(app)
        }

        promise.resolve(apps.toString())
      } catch (e: Exception) {
        promise.reject("GET_APPS_ERROR", e.message, e)
      }
    }

    // Get icon for a single package on demand
    AsyncFunction("getAppIcon") { packageName: String, promise: Promise ->
      try {
        val context = appContext.reactContext ?: throw Exception("Context is null")
        val pm: PackageManager = context.packageManager

        val appInfo = pm.getApplicationInfo(packageName, PackageManager.GET_META_DATA)
        val drawable = pm.getApplicationIcon(appInfo)

        val bitmap = drawableToBitmap(drawable)
        val stream = ByteArrayOutputStream()
        bitmap.compress(CompressFormat.PNG, 100, stream)
        val iconBase64 = Base64.encodeToString(stream.toByteArray(), Base64.NO_WRAP)

        promise.resolve(iconBase64)
      } catch (e: Exception) {
        // Return empty string instead of failing
        promise.resolve("")
      }
    }
  }

  // Convert drawable -> bitmap
  private fun drawableToBitmap(drawable: Drawable): Bitmap {
    return when (drawable) {
      is BitmapDrawable -> drawable.bitmap
      is AdaptiveIconDrawable -> {
        val bitmap = Bitmap.createBitmap(
          drawable.intrinsicWidth.takeIf { it > 0 } ?: 48,
          drawable.intrinsicHeight.takeIf { it > 0 } ?: 48,
          Bitmap.Config.ARGB_8888
        )
        val canvas = Canvas(bitmap)
        drawable.setBounds(0, 0, canvas.width, canvas.height)
        drawable.draw(canvas)
        bitmap
      }
      else -> {
        val width = drawable.intrinsicWidth.takeIf { it > 0 } ?: 48
        val height = drawable.intrinsicHeight.takeIf { it > 0 } ?: 48
        Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888).also { bitmap ->
          val canvas = Canvas(bitmap)
          drawable.setBounds(0, 0, canvas.width, canvas.height)
          drawable.draw(canvas)
        }
      }
    }
  }
}
