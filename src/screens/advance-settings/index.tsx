import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Trash2 } from 'lucide-react-native'

import { Button } from '@/components/reusables/ui/button'
import { Text } from '@/components/reusables/ui/text'
import { SafeScreen } from '@/components/template'
import { useDeleteAccount } from '@/lib/apis/useDeleteAccount'
import { useAppStore } from '@/lib/store/useAppStore'
import type {
  ApplicationScreenProps,
  ApplicationStackParamList
} from '@/types/navigation'

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1
  }
})

export function AdvanceSettings({
  navigation
}: ApplicationScreenProps<'AdvanceSettings'>) {
  const { reset } = useNavigation<NavigationProp<ApplicationStackParamList>>()

  const queryClient = useQueryClient()
  const user = useAppStore(s => s.user)
  const logout = useAppStore(s => s.logout)

  const resetNavigation = () => {
    setTimeout(() => {
      reset({
        index: 0,
        routes: [{ name: 'Login' }]
      })
    }, 0)
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
        'This action will delete your account along with all your data and active meals. Your account will be permanently deleted after 15 days. Are you sure you want to proceed?',
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
      <View className="flex-row items-center gap-3">
        <Button
          className="!px-0"
          variant="ghost"
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft color="#000" />
        </Button>
        <Text className="flex-1 text-center mr-8 text-2xl font-poppins">
          Advance Settings
        </Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
        className="flex-1"
      >
        <View className="gap-1.5 mt-4 flex-1">
          <Pressable
            onPress={onDeleteAccount}
            className="flex-row gap-2 justify-between items-center bg-white px-5 py-5 rounded-xl"
          >
            <View className="flex-row gap-3">
              <Trash2 color="#D12D2D" size={22} />
              <Text className="font-poppins text-brand-red">
                Delete your account
              </Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeScreen>
  )
}
