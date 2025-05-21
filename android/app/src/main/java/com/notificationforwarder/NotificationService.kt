package com.notificationforwarder

import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule

class NotificationService : NotificationListenerService() {
    private var reactContext: ReactContext? = null
    
    fun setReactContext(context: ReactContext) {
        this.reactContext = context
    }

    override fun onNotificationPosted(sbn: StatusBarNotification) {
        super.onNotificationPosted(sbn)
        try {
            val packageName = sbn.packageName ?: return
            val notification = sbn.notification ?: return
            val extras = notification.extras ?: return
            
            val title = extras.getString("android.title", "")
            val text = extras.getString("android.text", "")
            val postTime = sbn.postTime
            
            Log.d("NotificationService", "收到通知 - 应用: $packageName, 标题: $title, 内容: $text")
            
            val params: WritableMap = Arguments.createMap().apply {
                putString("packageName", packageName)
                putString("title", title)
                putString("message", text)
                putDouble("timestamp", postTime.toDouble())
                // 可以添加更多通知字段
                // putString("category", notification.category)
                // putBoolean("ongoing", notification.isOngoing)
                // putBoolean("clearable", notification.isClearable)
            }
            reactContext?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                ?.emit("onNotificationPosted", params)
        } catch (e: Exception) {
            Log.e("NotificationService", "处理通知时出错", e)
        }
        // val packageName = sbn.packageName ?: return
        
        // // 只处理LINE应用的通知
        // if (packageName.contains("jp.naver.line.android")) {
        //     val notification = sbn.notification ?: return
        //     val extras = notification.extras ?: return
            
        //     val title = extras.getString("android.title", "")
        //     val text = extras.getString("android.text", "")
            
        //     Log.d("NotificationService", "LINE通知: $title - $text")
            
        //     val params: WritableMap = Arguments.createMap().apply {
        //         putString("title", title)
        //         putString("message", text)
        //         putString("packageName", packageName)
        //     }
            
        //     reactContext?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        //         ?.emit("onNotificationReceived", params)
        // }
    }

    override fun onNotificationRemoved(sbn: StatusBarNotification) {
        super.onNotificationRemoved(sbn)
    }
}