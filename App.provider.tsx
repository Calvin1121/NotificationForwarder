import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AppStateStatus, AppState as RNAppState } from "react-native";
import { checkNotificationPermission } from "./utils/native";
import { DEFAUTL_INSTALLED_APPS } from "./const";
import { uniqBy } from "lodash";
import { InstalledApp, Notify } from "./native";


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
    notify: Notify | null
}

interface IAppContext {
    states: IAppContextState,
    updateStates: (inStates: InStates) => void
}

const States: IAppContextState = {
    status: APP_STATUS.Active,
    isNotifyPermitted: false,
    installedApps: DEFAUTL_INSTALLED_APPS,
    notify: null
}


export const AppContext = createContext<IAppContext>({
    states: States,
    updateStates: () => { }
})

export function AppProvider({ children }: { children: ReactNode }) {
    const [states, setStates] = useState({ ...States })
    const updateStates = useCallback((inStates: InStates) => {
        setStates((prev) => inStates instanceof Function ? inStates(prev) : ({ ...prev, ...inStates }))
    }, [])
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
    const installedApps = useMemo(() => uniqBy([...DEFAUTL_INSTALLED_APPS, ...states.installedApps], 'packageName') , [states.installedApps])
    const installedAppNameMap = useMemo(() => new Map(installedApps.map((item) => [item.packageName, item.appName])), [installedApps])
    const notify = useMemo(() => states.notify ?? null , [states.notify])
    return {
        isAppVisible,
        isNotifyPermitted,
        installedApps,
        installedAppNameMap,
        notify,
        states,
        updateStates,
    }
}
