/* eslint-disable react/no-unstable-nested-components */
import { useEffect } from 'react'
import { PermissionsAndroid, Platform } from 'react-native'
import messaging from '@react-native-firebase/messaging'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Home, Soup, User, Wallet } from 'lucide-react-native'

import { AccountTab } from '@/screens/account'
import { FoodTab } from '@/screens/food'
import { HomeTab } from '@/screens/home'
import { WalletTab } from '@/screens/wallet'
import type { ApplicationTabParamList } from '@/types/navigation'

const Tab = createBottomTabNavigator<ApplicationTabParamList>()

export function Tabs() {
  const checkApplicationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        )
      } else if (Platform.OS === 'ios') {
        await messaging().requestPermission()
      }
    } catch (error) {
      // Ignore
    }
  }

  useEffect(() => void checkApplicationPermission(), [])

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2B2B2B',
        tabBarInactiveTintColor: '#9A9A9A'
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeTab}
        options={{
          tabBarIcon(props) {
            return <Home {...props} />
          }
        }}
      />
      <Tab.Screen
        name="Food"
        component={FoodTab}
        options={{
          tabBarIcon(props) {
            return <Soup {...props} />
          }
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletTab}
        options={{
          tabBarIcon(props) {
            return <Wallet {...props} />
          }
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountTab}
        options={{
          tabBarIcon(props) {
            return <User {...props} />
          }
        }}
      />
    </Tab.Navigator>
  )
}
