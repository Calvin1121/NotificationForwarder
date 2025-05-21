package com.notificationforwarder

import android.content.Intent
import android.provider.Settings
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {
  private var notificationService: NotificationService? = null

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    checkNotificationPermission()
  }
  /**
    * 检查并请求通知监听权限
    */
  private fun checkNotificationPermission() {
      if (!isNotificationServiceEnabled()) {
          // 跳转到通知监听权限设置页面
          val intent = Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)
          startActivity(intent)
      }
  }

  /**
    * 检查是否已授予通知监听权限
    */
  private fun isNotificationServiceEnabled(): Boolean {
      val enabledListeners = Settings.Secure.getString(
          contentResolver,
          "enabled_notification_listeners"
      )
      return enabledListeners?.contains(packageName) == true
  }

  /**
    * 设置NotificationService实例
    */
  fun setNotificationService(service: NotificationService) {
      notificationService = service
      reactInstanceManager.currentReactContext?.let { reactContext ->
        // Log.d("MainActivity", "ReactContext状态: ${reactContext.isInitialized}")
        notificationService?.setReactContext(reactContext)
      }
      // reactInstanceManager?.currentReactContext?.let {
      //     notificationService?.setReactContext(it)
      // }
      // notificationService?.setReactContext(reactInstanceManager.currentReactContext)
  }

  
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "NotificationForwarder"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
