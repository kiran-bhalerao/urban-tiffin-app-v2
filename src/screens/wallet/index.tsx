import { useMemo } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  View
} from 'react-native'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'

import WalletAsset from '@/assets/images/wallet.png'
import { Text } from '@/components/reusables/ui/text'
import { SafeScreen } from '@/components/template'
import { useWalletDetails } from '@/lib/apis/useWalletDetails'
import { useWalletTransaction } from '@/lib/apis/useWalletTransactions'
import { formateFullDate } from '@/lib/functions/formate_full_date'
import { useRefresh } from '@/lib/hooks/useRefresh'
import { useAppStore } from '@/lib/store/useAppStore'
import { AddMoneyButton } from '@/screens/wallet/add-button'
import { WithdrawMoneyButton } from '@/screens/wallet/withdraw-button'
import type { ApplicationTabProps } from '@/types/navigation'
import { cn } from '@/lib/utils'

const styles = StyleSheet.create({
  image: {
    height: 120,
    width: 120
  },
  gap: { gap: 15, paddingBottom: 4 }
})

export function WalletTab({ navigation }: ApplicationTabProps<'Wallet'>) {
  const userId = useAppStore(s => s.user?._id)
  const { data } = useWalletDetails(userId)

  const {
    data: txData,
    isFetching,
    fetchNextPage
  } = useWalletTransaction(userId)

  const transactions = useMemo(
    () => txData?.pages.map(page => page.data.transactions).flat() || [],
    [txData?.pages]
  )

  const ListLoader = useMemo(() => {
    if (isFetching) {
      return (
        <View className="py-6">
          <ActivityIndicator size="large" />
        </View>
      )
    }

    return null
  }, [isFetching])

  const { refreshing, onRefresh } = useRefresh()

  return (
    <SafeScreen className="pb-0">
      <BottomSheetModalProvider>
        <View className="gap-1 pt-1.5 pb-3.5">
          <Text className="text-[22px] font-medium font-poppins">Wallet</Text>
        </View>
        <View className="flex-1">
          <View className="bg-white flex-row justify-between rounded-xl px-6 py-5 gap-3">
            <View className="gap-3">
              <Text className="text-sm uppercase font-medium font-poppins text-gray-500">
                Balance
              </Text>
              <Text className="font-semibold font-poppins text-4xl">
                ₹ {data?.data.wallet?.balance?.toLocaleString() || 'NA'}
              </Text>
              <View className="gap-y-1">
                <AddMoneyButton />
                <WithdrawMoneyButton />
              </View>
            </View>
            <Image style={styles.image} source={WalletAsset} />
          </View>
          <Text className="font-poppins text-lg mt-3.5 mb-3 font-semibold">
            Payment history
          </Text>
          <FlatList
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            data={transactions}
            renderItem={({ item }) => {
              const isNegative = ['meal_charge'].includes(
                item.transactionType.toLowerCase()
              )

              return (
                <View key={item._id} className="gap-2">
                  <View className="flex-row justify-between items-center">
                    <Text className="font-poppins font-semibold text-black/80">
                      {formateFullDate(item.createdAt)}
                    </Text>
                    <Text
                      className={cn(
                        'text-brand-green font-semibold font-poppins',
                        {
                          'text-brand-red': isNegative
                        }
                      )}
                    >
                      {isNegative ? '-' : '+'}₹
                      {Math.abs(Number(item.amount)).toLocaleString()}
                    </Text>
                  </View>
                  <View className="bg-white rounded-xl px-4 py-3.5 gap-1.5">
                    <View className="flex-row justify-between items-center">
                      <Text className="font-poppins capitalize">
                        {item.transactionType.replaceAll('_', ' ')}
                      </Text>
                      <View className="bg-brand-violet/10 rounded-lg px-2 py-1">
                        <Text className="font-poppins font-medium text-center text-xs text-brand-violet capitalize">
                          {item.paymentStatus || 'NA'}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row justify-between items-center">
                      <Text className="font-poppins text-sm text-gray-500">
                        Balance after recharge: ₹{item.balance.toLocaleString()}
                      </Text>
                      <Text className="font-poppins text-sm text-gray-500 uppercase">
                        {item.creditSource}
                      </Text>
                    </View>
                  </View>
                </View>
              )
            }}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={styles.gap}
            showsVerticalScrollIndicator={false}
            onEndReached={() => fetchNextPage()}
            onEndReachedThreshold={0.001}
            ListFooterComponent={userId ? ListLoader : undefined}
          />
        </View>
      </BottomSheetModalProvider>
    </SafeScreen>
  )
}
