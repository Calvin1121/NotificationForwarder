import type { FC } from 'react'
import { fetcher } from './utils/fetcher'
import { SWRConfig } from 'swr'

export const SWRProviderCache = new Map()

export const ConfigSWR: FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <SWRConfig
            value={{
                revalidateOnFocus: false,

                revalidateOnReconnect: true,

                shouldRetryOnError: false,
                dedupingInterval: 2000,

                provider: () => SWRProviderCache,

                fetcher,
            }}
        >
            {children}
        </SWRConfig>

    )
}
