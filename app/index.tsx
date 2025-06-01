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
            return <View className="flex flex-row items-center" key={ordersItem.value}>
                <View><Text>{ordersItem.label}:</Text></View>
                <View className="flex-1"><Text>{ordersItem.onContent?.(value) ?? value}</Text></View>
            </View>
        })}
    </View>
}

export default function Home() {
    const router = useRouter();
    const { isNotifyPermitted: isPermitted, notify, updateStates } = useStates();
    const [notifys, setNotifys] = useState<Notify[]>([]);

    useEffect(() => {
        if(notify) {
            setNotifys(prev => take(uniqBy([notify, ...prev], 'hashId'), MAX_NOTIFY_COUNT))
            updateStates({notify: null})
        }
    }, [notify])

    const notifyList = <FlatList
        renderItem={({ item }: { item: Notify }) => <NotifyItem item={item} />}
        keyExtractor={(item, index) => `${item.hashId ?? index}`}
        data={notifys} />;

    const onOpenSettings = () => {
        openNotificationSettings()
    };
    const onSwitchPacakge = () => {
        router.push('switch-package');
    };
    return (<SafeAreaView className="flex flex-1 overflow-hidden flex-col">
        <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
        {!isPermitted && <View className="flex flex-1 items-center justify-center">
            <Button onPress={onOpenSettings} title="Open Settings" />
        </View>}
        {isPermitted && <>
            <View className="flex flex-row items-center justify-between px-4 py-[13]">
                <View className="w-[30]" />
                <Text className="text-2xl">Notify history</Text>
                <IconFont onPress={onSwitchPacakge} size={30} name="setting" />
            </View>
            <View className={!notifys?.length ? 'flex-1 items-center justify-center' : 'flex-1'}>
                {isPermitted && !notifys?.length && <>
                    <View className="-mt-20"><IconFont size={150} name="empty" /></View>
                    <Text className="mt-4 text-xl text-gray-600">No any Notifies</Text>
                </>}
                {isPermitted && !!notifys?.length && notifyList}
            </View>
        </>}
    </SafeAreaView>);
}
