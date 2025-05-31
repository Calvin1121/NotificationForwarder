import { Button, EmitterSubscription, FlatList, NativeEventEmitter, NativeModules, StatusBar, StyleSheet, Text, View } from "react-native"
import { useStates } from "../App.provider"
import { useEffect, useRef, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import useSWRMutation from "swr/mutation"
import dayjs from "dayjs"
import { get } from "lodash"
import notifyApi from "../api/notify"
import { fetcher } from "../utils/fetcher"
import { DATE_FORMAT } from "../const"
const { NotificationModule } = NativeModules

interface Notify {
    message: string
    notifyId: number
    notifyKey: string
    packageName: string
    timestamp: number
    title: string
}

export const NotifyItem = ({ item }: { item: Notify }) => {
    const mapOrders = [
        { label: '时间', value: 'timestamp', onContent: (val: number) => dayjs(val).format(DATE_FORMAT) },
        { label: '来源', value: 'packageName' },
        { label: '标题', value: 'title' },
        { label: '内容', value: 'message' },
    ]
    console.info(item)
    return <>
        {mapOrders.map((ordersItem) => {
            const value = get(item, ordersItem.value)
            return <View key={ordersItem.value}>
                <Text>{ordersItem.label}</Text>
                <Text>{ordersItem.onContent?.(value) ?? value}</Text>
            </View>
        })}
    </>
}

export default function Home() {
    const { isNotifyPermitted: isPermitted } = useStates()
    const notifySubscription = useRef<EmitterSubscription>(null)
    const [notifys, setNotifys] = useState<any[]>([])
    const { data, trigger } = useSWRMutation(notifyApi.notifyLineWorks, async (url: string, { arg }: { arg: Record<string, any> }) =>
        fetcher(url, { method: 'post', body: JSON.stringify(arg) })
    )
    useEffect(() => {
        if (isPermitted && !notifySubscription.current) {
            const eventEmitter = new NativeEventEmitter();
            notifySubscription.current = eventEmitter.addListener('onNotificationPosted', data => {
                console.info(data)
                setNotifys((prev) => [...prev, data])
            })
        }
        if (!isPermitted && notifySubscription.current) {
            notifySubscription.current = null
        }
    }, [isPermitted])

    const notifyList = <FlatList
        renderItem={({ item }: { item: Notify }) => <NotifyItem item={item} />}
        keyExtractor={item => `${item.packageName}-${item.timestamp}`}
        data={notifys} />

    const onOpenSettings = () => {
        NotificationModule.openNotificationSettings()
    }
    return (<SafeAreaView style={styles.container}>
        <StatusBar barStyle={'dark-content'} />
        <View style={!isPermitted ? styles.settings : styles.content}>
            {!isPermitted && <Button onPress={onOpenSettings} title="Open Settings"></Button>}
            {isPermitted && notifyList}
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