import { FC, useMemo } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard'
import { ArrowLeft, Copy } from 'lucide-react-native'

import { Button } from '@/components/reusables/ui/button'
import { Text } from '@/components/reusables/ui/text'
import { SafeScreen } from '@/components/template'
import { OrderHistory, useOrderHistory } from '@/lib/apis/useOrderHistory'
import { useRefresh } from '@/lib/hooks/useRefresh'
import { useAppStore } from '@/lib/store/useAppStore'
import type { ApplicationScreenProps } from '@/types/navigation'
import Toast from 'react-native-toast-message'

const styles = StyleSheet.create({
  dish: { width: 48, height: 48 },
  gap: { gap: 16 }
})

interface MenuRowProps {
  date: string
  orders: OrderHistory[]
}

const MenuRow: FC<MenuRowProps> = ({ date, orders }) => {
  const innerOrders = orders.flatMap(order => order.items)
  const orderId = orders[0].orderId || orders[0]._id

  return (
    <View className="gap-2">
      <View className="flex-row justify-between gap-6 items-center">
        <Text className="font-poppins flex-1" numberOfLines={1}>
          {new Date(date).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}
        </Text>
        <Text className="text-brand-gray text-sm font-poppins">
          {innerOrders.length} Order(s)
        </Text>
      </View>
      {innerOrders.map((order, index) => {
        return (
          <View
            key={order._id + index}
            className="bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-50"
          >
            {/* Main content row */}
            <View className="flex-row justify-between items-start mb-2">
              <View className="flex-1 pr-4">
                <Text className="font-poppins font-semibold text-[16px] text-gray-900 mb-1">
                  {order.quantity} x {order.name}
                </Text>
                <Text className="font-poppins text-[13px] text-gray-600">
                  Kitchen: {orders[0].kitchen?.name ?? 'NA'}
                </Text>
              </View>

              {/* Status badges */}
              <View className="gap-2">
                <View className="bg-brand-violet/10 rounded-full px-3 py-1.5">
                  <Text className="font-poppins font-medium text-center text-[10px] text-brand-violet uppercase tracking-wide">
                    {order.status || 'NA'}
                  </Text>
                </View>
                <View className="bg-brand/10 rounded-full px-3 py-1.5">
                  <Text className="font-poppins font-medium text-center text-[10px] text-brand uppercase tracking-wide">
                    {order.mealTime}
                  </Text>
                </View>
              </View>
            </View>

            {/* Order ID row with better styling */}
            <View className="flex-row justify-between items-center pt-2 border-t border-gray-100">
              <View className="flex-1">
                <Text className="font-poppins text-[11px] text-gray-400 uppercase tracking-wide mb-0.5">
                  Order ID
                </Text>
                <Text className="font-poppins font-medium text-[13px] text-gray-700">
                  {orderId}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  Clipboard.setString(orderId)
                  Toast.show({ text1: 'Order ID copied!' })
                }}
                className="bg-gray-50 rounded-full p-2.5 ml-3"
                activeOpacity={0.7}
              >
                <Copy size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
        )
      })}
    </View>
  )
}

export function OrderHistoryScreen({
  navigation
}: ApplicationScreenProps<'OrderHistory'>) {
  const userId = useAppStore(s => s.user?._id)
  const { data, isFetching, fetchNextPage } = useOrderHistory(userId)

  const orderHistory = useMemo(
    () => data?.pages.map(page => page.data.orderHistory).flat() || [],
    [data?.pages]
  )

  const aggregateByDeliveryDate = useMemo(
    () =>
      orderHistory.reduce((acc, order) => {
        const date = order.deliveryDate.split('T')[0] // Extract date part
        if (!acc[date]) {
          acc[date] = []
        }
        acc[date].push(order)
        return acc
      }, {} as Record<string, typeof orderHistory>),
    [orderHistory]
  )

  const _data = Object.entries(aggregateByDeliveryDate).map(
    ([date, orders]) => ({ date, orders })
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
      <View className="flex-1 gap-2">
        <View className="flex-row items-center gap-3">
          <Button
            className="!px-0"
            variant="ghost"
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft color="#000" />
          </Button>
          <Text className="flex-1 text-center mr-8 text-2xl font-poppins">
            Order History
          </Text>
        </View>
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={_data}
          renderItem={({ item }) => (
            <MenuRow date={item.date} orders={item.orders} />
          )}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.gap}
          showsVerticalScrollIndicator={false}
          onEndReached={() => fetchNextPage()}
          onEndReachedThreshold={0.001}
          ListFooterComponent={userId ? ListLoader : undefined}
        />
      </View>
    </SafeScreen>
  )
}
