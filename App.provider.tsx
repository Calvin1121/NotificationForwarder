import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AppStateStatus, NativeModules, AppState as RNAppState } from "react-native";
const { NotificationModule } = NativeModules

enum APP_STATUS {
    Active = 'active',
    Inactive = 'inactive',
    Background = 'background',
    Unknown = 'unknown',
    Extension = 'extension'
}

interface IAppContextState {
    status: APP_STATUS
    permitted: boolean
}

interface IAppContext {
    states: IAppContextState,
}

const States: IAppContextState = {
    status: APP_STATUS.Active,
    permitted: false
}

export const AppContext = createContext<IAppContext>({
    states: States
})

export function AppProvider({ children }: { children: ReactNode }) {
    const [states, setStates] = useState({ ...States })
    useEffect(() => {
        const onAppStateChange = (status: AppStateStatus) => {
            setStates(prev => ({ ...prev, status: status as APP_STATUS }))
        }
        const appState = RNAppState.addEventListener('change', onAppStateChange)
        return () => appState.remove?.()
    }, [])
    const onPermitted = useCallback(async () => {
        if (states.status === APP_STATUS.Active) {
            const permitted = await NotificationModule.checkNotificationPermission()
            setStates(prev => ({ ...prev, permitted }))
        }
    }, [states.status])
    useEffect(() => {
        onPermitted()
    }, [onPermitted])
    const value = useMemo(() => ({ states }), [states])
    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export function useAppVisible() {
    const { states } = useContext(AppContext)
    return states.status === APP_STATUS.Active
}

export function usePermitted() {
    const { states } = useContext(AppContext)
    return !!states.permitted
}