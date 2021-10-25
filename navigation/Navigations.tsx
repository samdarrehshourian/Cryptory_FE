import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack'
import ListScreen from '../screens/ListScreen'
import HistoryScreen from '../screens/HistoryScreen'
import { RootStackParamList } from '../types/types'

const Stack = createNativeStackNavigator<RootStackParamList>();

const NavigationStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="ListScreen"
                component={ListScreen}
            />
            <Stack.Screen
                name="HistoryScreen"
                component={HistoryScreen}
            />
        </Stack.Navigator>
    )
}

export default NavigationStack;