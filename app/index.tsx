import { Button, EmitterSubscription, NativeEventEmitter, NativeModules, StatusBar, StyleSheet, Text, View } from "react-native"
import { useAppVisible, usePermitted } from "../App.provider"
import { useEffect, useRef, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import useSWRMutation from "swr/mutation"
import notifyApi from "../api/notify"
import { fetcher } from "../utils/fetcher"
const { NotificationModule } = NativeModules

export default function Home() {
    const isVisible = useAppVisible()
    const isPermitted = usePermitted()
    const notifySubscription = useRef<EmitterSubscription>(null)
    const [notifys, setNotifys] = useState<any[]>([])
    const { data, trigger } = useSWRMutation(notifyApi.notifyLineWorks, async (url: string, { arg }: { arg: Record<string, any> }) => 
        fetcher(url, { method: 'post', body: JSON.stringify(arg) })
    )
    useEffect(() => {
        console.info(data)
    }, [data])
    useEffect(() => {
        if (isVisible && isPermitted && !notifySubscription.current) {
            const eventEmitter = new NativeEventEmitter();
            notifySubscription.current = eventEmitter.addListener('onNotificationPosted', (data) => {
                setNotifys((prev) => [...prev, data])
                trigger(data)
            })
        }
    }, [isVisible, isPermitted, trigger])
    const onOpenSettings = () => {
        NotificationModule.openNotificationSettings()
    }
    return (<SafeAreaView style={styles.container}>
        <StatusBar />
        <View style={!isPermitted ? styles.settings : styles.content}>
            {!isPermitted && <Button onPress={onOpenSettings} title="Open Settings"></Button>}
            {isPermitted && <Text>{notifys?.length}</Text>}
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