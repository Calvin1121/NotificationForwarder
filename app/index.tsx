import { Button, EmitterSubscription, FlatList, NativeEventEmitter, NativeModules, StatusBar, StyleSheet, Text, View } from "react-native"
import { useStates } from "../App.provider"
import { useEffect, useRef, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import useSWRMutation from "swr/mutation"
import dayjs from "dayjs"
import { get, uniqBy } from "lodash"
import notifyApi from "../api/notify"
import { fetcher } from "../utils/fetcher"
import { DATE_FORMAT } from "../const"
import "../global.css"
import { generateHashId } from "../utils/util"
const { NotificationModule } = NativeModules

interface Notify {
    message: string
    notifyId: number
    notifyKey: string
    packageName: string
    timestamp: number
    title: string
    hashId?: string
}

export const NotifyItem = ({ item }: { item: Notify }) => {
    const mapOrders = [
        { label: '时间', value: 'timestamp', onContent: (val: number) => dayjs(val).format(DATE_FORMAT) },
        { label: '来源', value: 'packageName' },
        { label: '标题', value: 'title' },
        { label: '内容', value: 'message' },
    ]
    console.info(item)
    return <View className="py-2 px-4">
        {mapOrders.map((ordersItem) => {
            const value = get(item, ordersItem.value)
            return <View className="flex flex-row items-center" key={ordersItem.value}>
                <View><Text>{ordersItem.label}:</Text></View>
                <View className="flex-1"><Text>{ordersItem.onContent?.(value) ?? value}</Text></View>
            </View>
        })}
    </View>
}

export default function Home() {
    const TARGET_PACKAGENAMES = [
        'com.gworks.oneapp.works'
    ]
    const { isNotifyPermitted: isPermitted } = useStates()
    const notifySubscription = useRef<EmitterSubscription>(null)
    // const[map, {set, setAll, remove, reset}] = useMap({})
    const [newNotify, setNewNotify] = useState<Notify|null>()
    const [notifys, setNotifys] = useState<Notify[]>([])
    const { data, trigger } = useSWRMutation(notifyApi.notifyLineWorks, async (url: string, { arg }: { arg: Record<string, any> }) =>
        fetcher(url, { method: 'post', body: JSON.stringify(arg) })
    )
    useEffect(() => {
        if (isPermitted && !notifySubscription.current) {
            const eventEmitter = new NativeEventEmitter();
            notifySubscription.current = eventEmitter.addListener('onNotificationPosted', data => {
                console.info(data)
                if (TARGET_PACKAGENAMES.includes(data.packageName)) {
                    const hashId = generateHashId(data)
                    const _data = Object.assign(data, { hashId })
                    setNewNotify(prev => {
                        if (prev?.hashId !== hashId)
                            return _data
                        return prev
                    })
                }
            })
        }
        if (!isPermitted && notifySubscription.current) {
            notifySubscription.current = null
        }
    }, [isPermitted])

    useEffect(() => {
        if (newNotify?.hashId) {
            trigger(newNotify)
            setNotifys(prev => uniqBy([newNotify, ...prev], 'hashId'))
            setNewNotify(null)
        }
    }, [newNotify])

    const notifyList = <FlatList
        renderItem={({ item }: { item: Notify }) => <NotifyItem item={item} />}
        keyExtractor={(item, index) => `${item.hashId ?? index}`}
        data={notifys} />

    const onOpenSettings = () => {
        NotificationModule.openNotificationSettings()
    }
    return (<SafeAreaView className="flex flex-1 overflow-hidden flex-col">
        <StatusBar barStyle={'dark-content'} />
        <View className={isPermitted && !!notifys?.length? 'flex-1':'flex flex-1 items-center justify-center' }>
            {!isPermitted && <Button onPress={onOpenSettings} title="Open Settings"></Button>}
            {isPermitted && !notifys?.length && <Text>No any Notifies</Text>}
            {isPermitted && !!notifys?.length && notifyList}
        </View>
    </SafeAreaView>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
    },
    content: {
        flex: 1
    },
    settings: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
})