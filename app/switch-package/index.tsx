import React, { useEffect } from "react"
import { Text, View } from "react-native"

const SwitchPackage = () => {
    useEffect(() => {
        console.info('mounted')
        return () => {
            console.info('unmounted')
        }
    }, [])
    return <View>
        <Text>Switch Package</Text>
    </View>
}

export default SwitchPackage