import { StatusBar, StatusBarStyle, Text, View } from "react-native"
import IconFont, { IconNames } from "../_iconfont"
import { useRouter } from "react-native-auto-route"
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { ReactNode } from "react"

export interface Props {
    title?: string | ReactNode | (() => string | ReactNode)
    icon?: IconNames | null
    route?: string
    barStyle?: StatusBarStyle
    className?: string
}

const Header: React.FC<Props> = React.memo((props: Props) => {
    const { top } = useSafeAreaInsets()
    const router = useRouter();
    const canGoBack = router.canGoBack()
    const onPressIcon = () => {
        if (props.route)
            router.push(props.route)
    }
    const onBack = () => {
        router.back()
    }
    return <View className={`bg-white ${props.className}`} style={{paddingTop: top}}>
        <StatusBar barStyle={props.barStyle ?? 'dark-content'} />
        <View></View>
        <View className="flex flex-row items-center justify-between px-4 py-[13]">
            {!canGoBack && <View className="w-[30]" />}
            {canGoBack && <IconFont onPress={onBack} size={30} name='go-back' />}
            <View>
                {typeof props.title === 'string' && <Text className="text-xl">{props.title}</Text>}
                {props.title instanceof Function && props.title?.()}
                {!(props.title instanceof Function) && typeof props.title !== 'string' && props.title}
            </View>
            {props.icon && <IconFont onPress={onPressIcon} size={30} name={props.icon} />}
            {!props.icon && <View className="w-[30]" />}
        </View>
    </View>
})

export default Header