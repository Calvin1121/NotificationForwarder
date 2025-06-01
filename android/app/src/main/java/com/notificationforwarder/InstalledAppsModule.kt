package com.notificationforwarder

import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.util.Base64
import android.util.Log
import com.facebook.react.bridge.*

import java.io.ByteArrayOutputStream

class InstalledAppsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    init {
        currentReactContext = reactContext
    }
    override fun getName(): String = "InstalledAppsModule"

    @ReactMethod
    fun getInstalledApps(promise: Promise) {
        val pm = reactApplicationContext.packageManager
        val apps = pm.getInstalledApplications(PackageManager.GET_META_DATA)
        val result = WritableNativeArray()
        val currentPackageName = reactApplicationContext.packageName

        for (app in apps) {
            val packageName = app.packageName
            val appName = pm.getApplicationLabel(app).toString()

            // 过滤系统应用
            if ((app.flags and ApplicationInfo.FLAG_SYSTEM) != 0) continue

            if (packageName == currentPackageName) continue

            try {
                val map = WritableNativeMap()
                map.putString("packageName", packageName)
                map.putString("appName", appName)

                // 获取图标 Drawable
                val drawable = app.loadIcon(pm)
                val bitmap = drawableToBitmap(drawable)
                val base64Icon = bitmapToBase64(bitmap)
                map.putString("icon", base64Icon)

                result.pushMap(map)
            } catch (e: Exception) {
                // 忽略异常
            }
        }

        promise.resolve(result)
    }
    private fun drawableToBitmap(drawable: Drawable): Bitmap {
        if (drawable is BitmapDrawable) {
            return drawable.bitmap
        }

        val width = drawable.intrinsicWidth.coerceAtLeast(1)
        val height = drawable.intrinsicHeight.coerceAtLeast(1)
        val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bitmap)
        drawable.setBounds(0, 0, canvas.width, canvas.height)
        drawable.draw(canvas)
        return bitmap
    }

    private fun bitmapToBase64(bitmap: Bitmap): String {
        val byteArrayOutputStream = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream)
        val byteArray = byteArrayOutputStream.toByteArray()
        return Base64.encodeToString(byteArray, Base64.NO_WRAP)
    }
    
    companion object {
        var currentReactContext: ReactContext? = null
    }
}
