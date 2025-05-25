import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { AppStateStatus, AppState as RNAppState } from "react-native";

enum APP_STATUS {
    Active = 'active',
    Inactive = 'inactive',
    Background = 'background',
    Unknown = 'unknown',
    Extension = 'extension'
}

interface IAppContextState {
    status: APP_STATUS
}

interface IAppContext {
    states: IAppContextState
}

const States: IAppContextState = {
    status: APP_STATUS.Active
}

export const AppContext = createContext<IAppContext>({
    states: States
})

export function AppProvider({children}: {children: ReactNode}) {
    const [states, setStates] = useState({...States})
    useEffect(() => {
        const onAppStateChange = (status: AppStateStatus) => {
            setStates(prev => ({...prev, status: status as APP_STATUS}))
        }
        const appState = RNAppState.addEventListener('change', onAppStateChange)
        return () => appState.remove?.()
    }, [])
    const value = useMemo(() => ({states}), [states])
    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export function useAppVisible() {
    const { states } = useContext(AppContext)
    return states.status === APP_STATUS.Active
}