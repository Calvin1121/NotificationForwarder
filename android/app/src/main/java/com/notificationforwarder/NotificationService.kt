package com.notificationforwarder

import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.notificationforwarder.NotificationModule.Companion.currentReactContext

class NotificationService : NotificationListenerService() {

    override fun onNotificationPosted(sbn: StatusBarNotification) {
        try {
            val packageName = sbn.packageName ?: return
            val extras = sbn.notification.extras ?: return
            val title = extras.getString("android.title", "")
            val text = extras.getString("android.text", "")
            val postTime = sbn.postTime
            val sbnId = sbn.id
            val sbnKey = sbn.key
            val sbnTag = sbn.tag

            val params: WritableMap = Arguments.createMap().apply {
                putString("packageName", packageName)
                putString("title", title)
                putString("message", text)
                putDouble("timestamp", postTime.toDouble())
                putDouble("sbnId", sbnId.toDouble())
                putString("sbnKey", sbnKey)
                putString("sbnTag", sbnTag)
                // putInt("sbnUserId", UserHandle.getUserId(sbn.uid))
                // putString("notificationString", sbn.notification.toString())
            }

            currentReactContext
//                ?.takeIf { it.hasActiveCatalystInstance() }
                ?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                ?.emit("onNotificationPosted", params)
                ?: Log.w("NotificationService", "ReactContext 尚未就绪，无法发送通知")
        } catch (e: Exception) {
            Log.e("NotificationService", "处理通知时出错", e)
        }
    }

    override fun onNotificationRemoved(sbn: StatusBarNotification) {
        // 可选：处理通知移除事件
    }
}
