import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AppStateStatus, AppState as RNAppState } from "react-native";
import { checkNotificationPermission } from "./utils/native";
import { DEFAUTL_INSTALLED_APPS, DEFAUTL_LISTENING_APP } from "./const";
import { isEqual, uniq, uniqBy } from "lodash";
import { InstalledApp, Notify } from "./native";
import AsyncStorage from "@react-native-async-storage/async-storage";


enum APP_STATUS {
    Active = 'active',
    Inactive = 'inactive',
    Background = 'background',
    Unknown = 'unknown',
    Extension = 'extension'
}

type InStates = Partial<IAppContextState> | ((states: IAppContextState) => IAppContextState)

interface IAppContextState {
    status: APP_STATUS,
    isNotifyPermitted: boolean
    installedApps: InstalledApp[],
    notify: Notify | null,
    listeningApps: Array<InstalledApp['packageName']>
}

interface IAppContext {
    states: IAppContextState,
    updateStates: (inStates: InStates) => void
}

const States: IAppContextState = {
    status: APP_STATUS.Active,
    isNotifyPermitted: false,
    installedApps: DEFAUTL_INSTALLED_APPS,
    notify: null,
    listeningApps: []
}


export const AppContext = createContext<IAppContext>({
    states: States,
    updateStates: () => { }
})

export function AppProvider({ children }: { children: ReactNode }) {
    const [states, setStates] = useState({ ...States })
    const getListeningApps = async () => {
        const raw = await AsyncStorage.getItem('listeningApps')
        const listeningApps = raw ? JSON.parse(raw) : []
        return uniq([DEFAUTL_LISTENING_APP, ...listeningApps])
    }
    const updateStates = useCallback((inStates: InStates) => {
        setStates((prev) => inStates instanceof Function ? inStates(prev) : ({ ...prev, ...inStates }))
    }, [])
    useEffect(() => {
        const initListeningApps = async () => {
            const listeningApps = await getListeningApps()
            updateStates({ listeningApps })
        }
        initListeningApps()
    }, [])
    useEffect(() => {
        AsyncStorage.setItem('listeningApps', JSON.stringify(states.listeningApps))
    }, [states.listeningApps])
    useEffect(() => {
        const onAppStateChange = async (status: AppStateStatus) => {
            const isNotifyPermitted = states.isNotifyPermitted || (await checkNotificationPermission())
            updateStates({ status: status as APP_STATUS, isNotifyPermitted })
        }
        const appState = RNAppState.addEventListener('change', onAppStateChange)
        return () => appState.remove?.()
    }, [updateStates, states])

    const value = { states, updateStates }
    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export function useStates() {
    const { states, updateStates } = useContext(AppContext)
    const isAppVisible = useMemo(() => states.status === APP_STATUS.Active, [states.status])
    const isNotifyPermitted = useMemo(() => states.isNotifyPermitted, [states.isNotifyPermitted])
    const installedApps = useMemo(() => uniqBy([...DEFAUTL_INSTALLED_APPS, ...states.installedApps], 'packageName'), [states.installedApps])
    const listeningApps = useMemo(() => uniq([DEFAUTL_LISTENING_APP, ...states.listeningApps]), [states.listeningApps])
    const installedAppNameMap = useMemo(() => new Map(installedApps.map((item) => [item.packageName, item.appName])), [installedApps])
    const notify = useMemo(() => states.notify ?? null, [states.notify])
    return {
        isAppVisible,
        isNotifyPermitted,
        installedApps,
        listeningApps,
        installedAppNameMap,
        notify,
        states,
        updateStates,
    }
}
