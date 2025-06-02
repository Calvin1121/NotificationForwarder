import React, { useEffect } from "react"
import { FlatList, Image, StatusBar, Switch, SwitchChangeEvent, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import IconFont from "../_iconfont"
import Container from "../_components/container"
import { useStates } from "../../App.provider"
import { InstalledApp } from "../../native"
import { DEFAUTL_LISTENING_APP } from "../../const"

export const Item = ({ item }: { item: InstalledApp }) => {
    const { listeningApps, updateStates } = useStates()
    const isDefault = DEFAUTL_LISTENING_APP === item.packageName
    const isActive = listeningApps.includes(item.packageName)
    const onValueChange = (event: SwitchChangeEvent) => {
        const {packageName} = item;
        const existIndex = listeningApps?.findIndex(item => item === packageName)
        if(existIndex > -1) 
            updateStates({listeningApps: listeningApps.filter(item => item !== packageName)})
        else 
            updateStates({listeningApps: [...listeningApps, packageName]})
    }
    return <View className="flex items-center justify-center flex-row gap-4 p-4">
        <Image className="w-[50] h-[50]" source={{ uri: `data:image/png;base64,${item.icon}` }} />
        <View className="flex-1"><Text>{item.appName}</Text></View>
        <Switch
            onChange={onValueChange}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={'#fff'}
            value={isDefault || isActive}
            disabled={isDefault} />
    </View>
}
const SwitchPackage = () => {
    const { installedApps } = useStates()
    return <Container title='Notify Apps'>
        <View className="flex-1">
            <FlatList
                keyExtractor={(item) => item.packageName}
                data={installedApps}
                renderItem={({ item }) => <Item item={item} />} />
        </View>
    </Container>
}

export default SwitchPackage

export const screenOptions = { headerShown: false };
