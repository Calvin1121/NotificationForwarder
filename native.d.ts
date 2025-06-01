export interface Notify {
    message: string
    notifyId: number
    notifyKey: string
    packageName: string
    timestamp: number
    title: string
    sbnId: string
    sbnKey: string
    sbnTag: string
    hashId?: string
}

export interface InstalledApp {
    appName: string
    icon: string
    packageName: string
}