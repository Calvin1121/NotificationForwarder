package com.notificationforwarder

import android.content.Intent
import android.provider.Settings
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class NotificationModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    init {
        currentReactContext = reactContext
    }

    override fun getName(): String = "NotificationModule"

    @ReactMethod
    fun checkNotificationPermission(promise: Promise) {
        val enabledListeners = Settings.Secure.getString(
            reactApplicationContext.contentResolver,
            "enabled_notification_listeners"
        )
        val granted = enabledListeners?.contains(reactApplicationContext.packageName) == true
        promise.resolve(granted)
    }

    @ReactMethod
    fun openNotificationSettings() {
        val intent = Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        reactApplicationContext.startActivity(intent)
    }

    companion object {
        var currentReactContext: ReactContext? = null
    }
}
