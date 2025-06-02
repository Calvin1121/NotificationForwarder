import { ReactNode } from "react"
import { View, StatusBarStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import Header, { Props as HeaderProps } from "./header"

interface Props extends HeaderProps {
    barStyle?: StatusBarStyle
    children: ReactNode
    className?: string
    
}

const Container = (props: Props) => {
    const { bottom} = useSafeAreaInsets()
    const { children, ...rest } = props
    return <View className={`flex-1 overflow-hidden flex-col`}>
        <Header {...rest} />
        {children}
        <View style={{ paddingBottom: Math.max(bottom, 16) }} />
    </View>
}

export default Container