import { useEffect, useRef, useState } from "react";
import { Button, EmitterSubscription, Linking, NativeEventEmitter, NativeModules, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";

type NotificationData = {
  packageName: string;
  title: string;
  message: string;
  timestamp: number;
};

const { NotificationModule } = NativeModules
const App = () => {
  const [hasPermission, setHasPermission] = useState(false)
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const subscriptionRef = useRef<EmitterSubscription>(null)
  const checkPermission = async () => {
    try {
      const granted = await NotificationModule.checkNotificationPermission()
      setHasPermission(granted)
    } catch (error) {

    }
  }
  const setupNotificationListener = () => {
    
  }
  const openNotificationSettings = () => {
    NotificationModule.openNotificationSettings()
  }
  useEffect(() => {
    checkPermission()
    const eventEmitter = new NativeEventEmitter();
    const subscription = eventEmitter.addListener('onNotificationPosted', (data: NotificationData) => {
      console.info(data)
      setNotifications(prev => [data, ...prev.slice(0, 9)]);
    })
    return () => {
      subscription.remove()
    }
  }, [])

  useEffect(() => {
    console.info(hasPermission, 'hasPermission')
    // if (!hasPermission) {
    //   openNotificationSettings()
    // } else {
    //   setupNotificationListener()
    // }
  }, [hasPermission])
  return <View>
    <StatusBar />
    <SafeAreaView style={styles.container}>
      <Button onPress={openNotificationSettings} title="Granted Permission"></Button>
      <Text style={styles.permissionText}>{hasPermission ? 'Granted Permission' : 'No Permission'}</Text>
      <Text style={styles.permissionText}>{notifications?.length || 0}</Text>
    </SafeAreaView>
  </View>
}
const styles = StyleSheet.create({
  container: {
    paddingBlockStart: 50
  },
  permissionText: {
    fontSize: 18,
    marginTop: 50,
    color: '#000'
  },
})
export default App;