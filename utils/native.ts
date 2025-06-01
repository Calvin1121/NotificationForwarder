import { NativeModules } from "react-native"

const { NotificationModule, InstalledAppsModule } = NativeModules

export async function checkNotificationPermission(): Promise<boolean> {
    return await NotificationModule.checkNotificationPermission()
}

export function openNotificationSettings() {
    NotificationModule.openNotificationSettings();
}

export async function getInstalledApps() {
    return await InstalledAppsModule.getInstalledApps();
}