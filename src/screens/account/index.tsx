import { Fragment } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { useQueryClient } from '@tanstack/react-query'
import {
  ChevronRight,
  Clock,
  Headset,
  Info,
  LogIn,
  LogOut,
  MapPin,
  Settings,
  User
} from 'lucide-react-native'

import { Text } from '@/components/reusables/ui/text'
import { SafeScreen } from '@/components/template'
import { useDeleteAccount } from '@/lib/apis/useDeleteAccount'
import { useAppStore } from '@/lib/store/useAppStore'
import { cn } from '@/lib/utils'
import type {
  ApplicationStackParamList,
  ApplicationTabProps
} from '@/types/navigation'
import { useCartStore } from '@/lib/store/useCartStore'

const styles = StyleSheet.create({
  stretch: {
    alignSelf: 'stretch',
    height: 'auto',
    flex: 1,
    flexGrow: 1
  },
  scrollView: {
    flexGrow: 1
  }
})

export function AccountTab({ navigation }: ApplicationTabProps<'Account'>) {
  const { navigate, reset } =
    useNavigation<NavigationProp<ApplicationStackParamList>>()

  const queryClient = useQueryClient()
  const user = useAppStore(s => s.user)
  const accessToken = useAppStore(s => s.accessToken)
  const logout = useAppStore(s => s.logout)
  const clearCart = useCartStore(s => s.clearCart)

  const resetNavigation = () => {
    setTimeout(() => {
      reset({
        index: 0,
        routes: [{ name: 'Login' }]
      })
    }, 0)
  }

  const onLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'YES',
        onPress: () => {
          queryClient.clear()
          clearCart()
          logout()
          resetNavigation()
        }
      }
    ])
  }

  const { mutate } = useDeleteAccount({
    onError(error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error
      })
    },
    onSuccess({ message }) {
      Toast.show({
        type: 'success',
        text1: 'Account deletion',
        text2: message
      })
      queryClient.clear()
      logout()
      resetNavigation()
    }
  })

  const onDeleteAccount = () => {
    if (user?._id)
      Alert.alert(
        'Delete account',
        'This action will delete you account along with all the data and active meals, you want to delete?',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'YES',
            onPress: () => mutate({ userId: user?._id })
          }
        ]
      )
  }

  return (
    <SafeScreen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
        className="flex-1"
      >
        {!!accessToken && (
          <View className="gap-1 px-1.5 pt-1.5 pb-3.5 border-b border-gray-400">
            <Text className="text-[22px] font-medium font-poppins">
              {user?.name || 'Username'}
            </Text>
            <Text className="font-poppins text-gray-500">
              +91 {user?.mobile} &#x2022; {user?.email || 'user@example.com'}
            </Text>
          </View>
        )}
        <View className="gap-1.5 mt-4 flex-1">
          {!!accessToken && (
            <Fragment>
              <Pressable
                onPress={() => navigate('EditProfile')}
                className="flex-row gap-2 justify-between items-center bg-white px-5 py-5 rounded-xl"
              >
                <View className="flex-row gap-3">
                  <User color="#676767" size={22} />
                  <Text className="font-poppins text-brand-dark-gray">
                    Profile details
                  </Text>
                </View>
                <ChevronRight color="#676767" size={22} />
              </Pressable>
              <Pressable
                onPress={() => navigate('OrderHistory')}
                className="flex-row gap-2 justify-between items-center bg-white px-5 py-5 rounded-xl"
              >
                <View className="flex-row gap-3">
                  <Clock color="#676767" size={22} />
                  <Text className="font-poppins text-brand-dark-gray">
                    Order History
                  </Text>
                </View>
                <ChevronRight color="#676767" size={22} />
              </Pressable>
              <Pressable
                onPress={() => navigate('MyAddresses')}
                className="flex-row gap-2 justify-between items-center bg-white px-5 py-5 rounded-xl"
              >
                <View className="flex-row gap-3">
                  <MapPin color="#676767" size={22} />
                  <Text className="font-poppins text-brand-dark-gray">
                    Addresses
                  </Text>
                </View>
                <ChevronRight color="#676767" size={22} />
              </Pressable>
              <Pressable
                onPress={() => navigate('AdvanceSettings')}
                className="flex-row gap-2 justify-between items-center bg-white px-5 py-5 rounded-xl"
              >
                <View className="flex-row gap-3">
                  <Settings color="#676767" size={22} />
                  <Text className="font-poppins text-brand-dark-gray">
                    Advance
                  </Text>
                </View>
                <ChevronRight color="#676767" size={22} />
              </Pressable>
            </Fragment>
          )}
          <Pressable
            onPress={() => navigate('About')}
            className="flex-row gap-2 justify-between items-center bg-white px-5 py-5 rounded-xl"
          >
            <View className="flex-row gap-3">
              <Info color="#676767" size={21} />
              <Text className="font-poppins text-brand-dark-gray">About</Text>
            </View>
            <ChevronRight color="#676767" size={22} />
          </Pressable>
          <Pressable
            onPress={() => navigate('Help')}
            className="flex-row gap-2 justify-between items-center bg-white px-5 py-5 rounded-xl"
          >
            <View className="flex-row gap-3">
              <Headset color="#676767" size={21} />
              <Text className="font-poppins text-brand-dark-gray">Help</Text>
            </View>
            <ChevronRight color="#676767" size={22} />
          </Pressable>
          <Pressable
            onPress={() => {
              if (accessToken) {
                onLogout()
              } else {
                resetNavigation()
              }
            }}
            className="flex-row gap-2 justify-between items-center bg-white px-5 py-5 rounded-xl"
          >
            <View className="flex-row gap-3">
              {accessToken ? (
                <LogOut color="#D12D2D" size={22} />
              ) : (
                <LogIn color="#00CC52" size={22} />
              )}
              <Text
                className={cn('font-poppins text-brand-red', {
                  'text-brand-green': !accessToken
                })}
              >
                {accessToken ? 'Logout' : 'Login'}
              </Text>
            </View>
          </Pressable>
        </View>
        <Pressable>
          <Text className="font-poppins text-center text-brand-text/75 mt-2">
            Urban Tiffin v0.1.7
          </Text>
        </Pressable>
      </ScrollView>
    </SafeScreen>
  )
}
