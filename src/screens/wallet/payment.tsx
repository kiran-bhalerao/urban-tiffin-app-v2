/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { FC, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import PhonePePaymentSDK from 'react-native-phonepe-pg'
import Toast from 'react-native-toast-message'
import { BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet'
import { useQueryClient } from '@tanstack/react-query'

import { Button } from '@/components/reusables/ui/button'
import { Text } from '@/components/reusables/ui/text'
import { usePgCheckout } from '@/lib/apis/usePgCheckout'
import { useAppStore } from '@/lib/store/useAppStore'

const styles = StyleSheet.create({
  input: {
    padding: 8,
    fontSize: 24,
    fontWeight: 'bold',
    width: '80%',
    color: '#000000'
  },
  scrollView: {
    flexGrow: 1
  }
})

export const Payment: FC<{ close: () => void }> = ({ close }) => {
  const [amount, setAmount] = useState<string>()

  const queryClient = useQueryClient()
  const { mutateAsync } = usePgCheckout()
  const mobile = useAppStore(s => s.user?.mobile)
  const customerId = useAppStore(s => s.user?._id)

  const onAddMoney = () => {
    if (!mobile) return
    if (!amount || Number.isNaN(Number(amount))) {
      Toast.show({
        text1: 'Invalid amount',
        type: 'error'
      })
      return
    }

    // if (Number(amount) < 200) {
    if (Number(amount) < 1) {
      Toast.show({
        text1: 'minimum accepted amount is 200',
        type: 'error'
      })
      return
    }

    if (!customerId) return

    mutateAsync({ amount: Number(amount), customerId })
      .then(res => {
        const { environment, checksum, merchant_id, payload_main } = res
        const isDebuggingEnabled = environment === 'SANDBOX'
        const appId = ''

        PhonePePaymentSDK.init(
          environment,
          merchant_id,
          appId,
          isDebuggingEnabled
        )
          .then(() => {
            PhonePePaymentSDK.startTransaction(
              payload_main,
              checksum,
              null,
              null
            )
              .then(a => {
                if (a.status === 'SUCCESS') {
                  void queryClient.refetchQueries({
                    queryKey: ['wallet-details']
                  })
                  void queryClient.refetchQueries({
                    queryKey: ['wallet-transactions']
                  })
                  Toast.show({ text1: 'Payment successful' })
                  close()
                } else {
                  const errLen = a.error?.length || 0
                  Toast.show({
                    text1: 'Payment failed',
                    text2: errLen > 80 ? 'Something went wrong' : a.error,
                    type: 'error'
                  })
                }
              })
              .catch(err =>
                Toast.show({
                  text1: 'Payment failed',
                  text2: err.message,
                  type: 'error'
                })
              )
          })
          .catch(err =>
            Toast.show({
              text1: 'Payment failed',
              text2: err.message,
              type: 'error'
            })
          )
      })
      .catch(err =>
        Toast.show({
          text1: 'Payment failed',
          text2: err.message,
          type: 'error'
        })
      )
  }

  return (
    <BottomSheetView className="px-4 flex-1 py-4 gap-y-3">
      <View className="flex-row justify-between items-end">
        <Text className="font-poppins uppercase font-medium">Enter amount</Text>
      </View>
      <ScrollView className="flex-1" contentContainerStyle={styles.scrollView}>
        <View className="flex-row items-center w-full mb-4">
          <Text className="font-poppins uppercase text-2xl mt-1 font-semibold">
            ₹
          </Text>
          <BottomSheetTextInput
            keyboardType="number-pad"
            value={amount}
            onChangeText={setAmount}
            placeholder="00.00"
            style={styles.input}
            placeholderTextColor="#C7C7C7"
          />
        </View>
        <View className="gap-x-2 flex-row mt-auto">
          <Button
            onPress={() => setAmount('200')}
            size="sm"
            variant="outline"
            className="border-brand w-28"
          >
            <Text className="font-poppins text-brand font-semibold text-sm">
              ₹200
            </Text>
          </Button>
          <Button
            onPress={() => setAmount('500')}
            size="sm"
            variant="outline"
            className="border-brand w-28"
          >
            <Text className="font-poppins text-brand font-semibold text-sm">
              ₹500
            </Text>
          </Button>
          <Button
            onPress={() => setAmount('1000')}
            size="sm"
            variant="outline"
            className="border-brand w-28"
          >
            <Text className="font-poppins text-brand font-semibold text-sm">
              ₹1000
            </Text>
          </Button>
        </View>
      </ScrollView>
      <Button
        onPress={onAddMoney}
        className="bg-brand rounded-xl mt-auto"
        size="sm"
      >
        <Text className="font-poppins font-semibold">PAY NOW</Text>
      </Button>
    </BottomSheetView>
  )
}
