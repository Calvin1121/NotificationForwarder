import { Button, FlatList, StatusBar, Text, View } from "react-native"
import { useEffect, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import dayjs from "dayjs"
import { get, take, uniqBy } from "lodash"
import { DATE_FORMAT, MAX_NOTIFY_COUNT } from "../const"
import "../global.css"
import { useRouter } from "react-native-auto-route"
import { useStates } from "../App.provider"
import IconFont from './_iconfont';
import { openNotificationSettings } from "../utils/native"
import { Notify } from "../native"
import Container from "./_components/container"

export const NotifyItem = ({ item }: { item: Notify }) => {
    const { installedAppNameMap } = useStates()
    const mapOrders = [
        { label: '时间', value: 'timestamp', onContent: (val: number | string) => dayjs(val).format(DATE_FORMAT) },
        { label: '来源', value: 'packageName', onContent: (val: string) => installedAppNameMap.get(val) ?? val },
        { label: '标题', value: 'title' },
        { label: '内容', value: 'message' },
    ]
    return <View className="py-2 px-4">
        {mapOrders.map((ordersItem) => {
            const value = get(item, ordersItem.value)
            return <View className="flex flex-row" key={ordersItem.value}>
                <View><Text>{ordersItem.label}:</Text></View>
                <View className="flex-1"><Text>{ordersItem.onContent?.(value) ?? value}</Text></View>
            </View>
        })}
    </View>
}

export default function Home() {
    const { isNotifyPermitted: isPermitted, notify, updateStates } = useStates();
    const [notifys, setNotifys] = useState<Notify[]>([]);

    useEffect(() => {
        if (notify) {
            setNotifys(prev => take(uniqBy([notify, ...prev], 'hashId'), MAX_NOTIFY_COUNT))
            updateStates({ notify: null })
        }
    }, [notify])

    const notifyList = <FlatList
        renderItem={({ item }: { item: Notify }) => <NotifyItem item={item} />}
        keyExtractor={(item, index) => `${item.hashId ?? index}`}
        data={notifys} />;

    const onOpenSettings = () => {
        openNotificationSettings()
    };
    return <Container
        icon={isPermitted ? 'setting' : null}
        route="switch-package"
        title="Notify history">
        {!isPermitted && <View className="flex flex-1 items-center justify-center">
            <Button onPress={onOpenSettings} title="Open Settings" />
        </View>}
        {isPermitted && <View className={!notifys?.length ? 'flex-1 items-center justify-center' : 'flex-1'}>
            {isPermitted && !notifys?.length && <>
                <View className="-mt-20"><IconFont size={150} name="empty" /></View>
                <Text className="mt-4 text-xl text-gray-600">No any Notifies</Text>
            </>}
            {isPermitted && !!notifys?.length && notifyList}
        </View>}
    </Container>
}
