/* eslint-disable react-native/no-inline-styles */
import { useRef } from 'react'
import { Keyboard, ScrollView, StyleSheet, View } from 'react-native'
import OTPTextView from 'react-native-otp-textinput'
import Toast from 'react-native-toast-message'

import { Brand } from '@/components/molecules/Brand'
import { Button } from '@/components/reusables/ui/button'
import { Text } from '@/components/reusables/ui/text'
import { SafeScreen } from '@/components/template'
import { useVerifyOtp } from '@/lib/apis/useVerifyOtp'
import { useAppStore } from '@/lib/store/useAppStore'
import type { ApplicationScreenProps } from '@/types/navigation'

const styles = StyleSheet.create({
  roundedTextInput: {
    borderRadius: 10,
    flex: 1,
    borderWidth: 1,
    borderBottomWidth: 1,
    backgroundColor: '#ffffff'
  }
})

export function OtpScreen({
  navigation,
  route
}: ApplicationScreenProps<'Otp'>) {
  const otpInput = useRef<OTPTextView | null>(null)

  const id = route.params?._id
  const mobile = route.params?.mobile
  const isSignup = route.params?.isSignup || false

  const { mutateAsync, isPending } = useVerifyOtp()

  const setUser = useAppStore(s => s.setUser)
  const setAccessToken = useAppStore(s => s.setAccessToken)

  const onSubmitPress = () => {
    const otpStr = otpInput.current?.state.otpText.join('') || ''

    if (otpStr.length < 4) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter OTP'
      })

      return
    }

    const otp = Number(otpStr)
    if (Number.isNaN(otp)) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter valid OTP'
      })

      return
    }

    if (isSignup) {
      navigation.navigate('CreateProfile', { _id: id, mobile, otp })
    } else {
      mutateAsync({ otp, mobile, _id: id })
        .then(({ message, data: { token, user } }) => {
          // save accessToken
          Toast.show({
            type: 'success',
            text1: 'Login Success',
            text2: message
          })

          setAccessToken(token)
          setUser(user)
        })
        .catch((err: string) => {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: err
          })
        })
    }
  }

  return (
    <SafeScreen>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flex: 1 }}
        automaticallyAdjustKeyboardInsets
      >
        <View className="justify-center flex-1">
          <Brand className="mt-8" />
        </View>
        <View className="gap-2 justify-center flex-[1.5]">
          <Text className="text-4xl text-center font-bold text-slate-700 font-poppins">
            OTP verification
          </Text>
          <Text className="text-lg text-center text-brand-light-gray font-poppins mb-8">
            We have send you an OTP to {mobile} {'\n'} via SMS
          </Text>
          <OTPTextView
            ref={e => {
              otpInput.current = e
            }}
            handleTextChange={t => {
              if (t.length === 4) {
                Keyboard.dismiss()
              }
            }}
            tintColor="#FFA922"
            textInputStyle={styles.roundedTextInput}
          />
        </View>
        <View className="flex mt-auto gap-3">
          <Button
            className="mt-auto"
            variant="link"
            size="lg"
            onPress={() => navigation.goBack()}
          >
            <Text className="text-blue-500 underline font-light font-poppins">
              Change number?
            </Text>
          </Button>
          <Button
            className="bg-brand rounded-xl"
            size="lg"
            isLoading={isPending}
            onPress={onSubmitPress}
          >
            <Text className="font-poppins">SUBMIT</Text>
          </Button>
        </View>
      </ScrollView>
    </SafeScreen>
  )
}
