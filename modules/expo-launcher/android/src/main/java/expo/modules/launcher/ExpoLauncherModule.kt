package expo.modules.launcher

import android.app.Activity
import android.content.Intent
import android.content.pm.ApplicationInfo
import android.os.Build
import android.provider.Settings
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.tencent.mmkv.MMKV
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoLauncherModule : Module() {

    // ---------------- MMKV STORES ----------------
    private val kidSafeStore by lazy { MMKV.mmkvWithID("kid-safe-apps-store") }
    private val allAppsStore by lazy { MMKV.mmkvWithID("all-apps") }
    private val gson = Gson()

   
    override fun definition() = ModuleDefinition {
        Name("ExpoLauncher")

        // Launcher / home management
        AsyncFunction("requestSetDefaultLauncher") { requestSetDefaultLauncher() }
        AsyncFunction("isDefaultLauncher") { isDefaultLauncher() }
        AsyncFunction("setAsDefaultLauncher") { setAsDefaultLauncher() }

        // Installed apps
        AsyncFunction("getInstalledApps") { getInstalledApps() }
        AsyncFunction("getKidSafeApps") { getKidSafeApps() }

        // Open any app
        AsyncFunction("openApp") { packageName: String -> openApp(packageName) }

        // Kiosk mode
        AsyncFunction("startKioskMode") { startKioskMode() }
        AsyncFunction("stopKioskMode") { stopKioskMode() }

      
    }

    // ---------------- UTILITY ----------------
    private fun requireContext() = appContext.reactContext
        ?: throw IllegalStateException("React context not available")

    // ---------------- DEFAULT LAUNCHER ----------------
    private fun isDefaultLauncher(): Boolean {
        val context = requireContext()
        val intent = Intent(Intent.ACTION_MAIN).apply { addCategory(Intent.CATEGORY_HOME) }
        val resolveInfo = context.packageManager.resolveActivity(intent, 0)
        val currentLauncher = resolveInfo?.activityInfo?.packageName
        return currentLauncher == context.packageName
    }

    private fun setAsDefaultLauncher() {
        val context = requireContext()
        val intent = Intent(Settings.ACTION_HOME_SETTINGS).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(intent)
    }

    private fun requestSetDefaultLauncher() {
        val context = requireContext()
        val intent = Intent(Settings.ACTION_HOME_SETTINGS).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(intent)
    }

    // ---------------- INSTALLED APPS ----------------
    private fun getInstalledApps(): List<Map<String, Any>> {
        val context = requireContext()
        val pm = context.packageManager

        val apps = pm.getInstalledApplications(0)
            .filter { it.flags and ApplicationInfo.FLAG_SYSTEM == 0 }
            .map {
                mapOf(
                    "packageName" to it.packageName,
                    "appName" to pm.getApplicationLabel(it).toString()
                )
            }

        // Save all apps to MMKV
        allAppsStore.encode("allApps", gson.toJson(apps))
        return apps
    }

    private fun getKidSafeApps(): List<Map<String, Any>> {
        return try {
            val safeJson = kidSafeStore.decodeString("kidSafeApps", "[]") ?: "[]"
            val safePackages: List<String> = gson.fromJson(
                safeJson, object : TypeToken<List<String>>() {}.type
            )

            val allAppsJson = allAppsStore.decodeString("allApps", "[]") ?: "[]"
            val allApps: List<Map<String, Any>> = gson.fromJson(
                allAppsJson, object : TypeToken<List<Map<String, Any>>>() {}.type
            )

            allApps.filter { safePackages.contains(it["packageName"]) }
        } catch (e: Exception) {
            emptyList()
        }
    }

    // ---------------- OPEN APP ----------------
    private fun openApp(packageName: String) {
        val context = requireContext()
        val intent = context.packageManager.getLaunchIntentForPackage(packageName)
            ?: throw IllegalArgumentException("App not found: $packageName")
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        context.startActivity(intent)

        // Notify RN that this app was opened
    }

    // ---------------- KIOSK MODE ----------------
    private fun startKioskMode() {
        val context = requireContext()
        val activity = context as? Activity ?: return

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            try {
                activity.startLockTask()
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    private fun stopKioskMode() {
        val context = requireContext()
        val activity = context as? Activity ?: return

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            try {
                activity.stopLockTask()
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}
