/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { FC, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet'
import { useQueryClient } from '@tanstack/react-query'

import { Button } from '@/components/reusables/ui/button'
import { Text } from '@/components/reusables/ui/text'
import { useWalletWithdraw } from '@/lib/apis/useWalletWithdraw'
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

export const Withdraw: FC<{ close: () => void }> = ({ close }) => {
  const [amount, setAmount] = useState<string>()

  const queryClient = useQueryClient()
  const { mutateAsync } = useWalletWithdraw()
  const mobile = useAppStore(s => s.user?.mobile)
  const customerId = useAppStore(s => s.user?._id)

  const onWithdrawMoney = () => {
    if (!mobile) return
    if (!amount || Number.isNaN(Number(amount))) {
      Toast.show({
        text1: 'Invalid amount',
        type: 'error'
      })
      return
    }

    if (Number(amount) < 1) {
      Toast.show({
        text1: 'minimum accepted amount is 1',
        type: 'error'
      })
      return
    }

    if (!customerId) return

    mutateAsync({ amount: Number(amount), userId: customerId })
      .then(() => {
        Toast.show({ text1: 'Withdraw successful' })
        void queryClient.refetchQueries({
          queryKey: ['wallet-details']
        })
        void queryClient.refetchQueries({
          queryKey: ['wallet-transactions']
        })
        close()
      })
      .catch(err =>
        Toast.show({
          text1: 'Withdraw failed',
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
        onPress={onWithdrawMoney}
        className="bg-brand rounded-xl mt-auto"
        size="sm"
      >
        <Text className="font-poppins font-semibold">WITHDRAW NOW</Text>
      </Button>
    </BottomSheetView>
  )
}
