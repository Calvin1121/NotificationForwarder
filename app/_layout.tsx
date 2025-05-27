import { Stack } from "react-native-auto-route"

const AppLayout = () => {
    return <Stack initialRouteName="index">
        <Stack.Screen name="index" options={{headerShown: false}} />
    </Stack>
}

export default AppLayout