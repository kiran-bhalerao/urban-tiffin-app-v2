import React, { useCallback, useMemo, useState } from 'react'
import { Alert, FlatList, Pressable, ScrollView, View } from 'react-native'
import { ArrowLeft, Calendar, Clock } from 'lucide-react-native'
import Toast from 'react-native-toast-message'
import { useQueryClient } from '@tanstack/react-query'

import { Button } from '@/components/reusables/ui/button'
import { Text } from '@/components/reusables/ui/text'
import { SafeScreen } from '@/components/template'
import { useSaveMeal } from '@/lib/apis/useSaveMeal'
import { useCartStore, type CartItem } from '@/lib/store/useCartStore'
import { useAppStore } from '@/lib/store/useAppStore'
import { cn } from '@/lib/utils'
import type { ApplicationScreenProps } from '@/types/navigation'
import { useKitchenMeals } from '@/lib/apis/useKitchenMeals'

interface ScheduleSummaryProps {
  items: CartItem[]
}

const ScheduleSummary: React.FC<ScheduleSummaryProps> = ({ items }) => {
  const itemsByDate = useMemo(() => {
    const grouped = items.reduce((acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = []
      }
      acc[item.date].push(item)
      return acc
    }, {} as Record<string, CartItem[]>)

    return Object.entries(grouped)
      .map(([date, dateItems]) => ({
        date,
        items: dateItems,
        total: dateItems.reduce(
          (sum, item) => sum + item.meal.price * item.quantity,
          0
        )
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [items])

  return (
    <View className="bg-white rounded-lg p-4 mb-2.5 shadow-sm border border-gray-200">
      <Text className="font-bold text-lg text-gray-900 mb-3">
        Schedule Summary
      </Text>
      {itemsByDate.map(({ date, items: dateItems, total }) => (
        <View key={date} className="mb-3 last:mb-0">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <Calendar size={16} color="#6b7280" />
              <Text className="font-semibold text-gray-900 ml-2">
                {new Date(date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric'
                })}
              </Text>
            </View>
            <Text className="font-semibold text-gray-700">
              ₹{total.toLocaleString()}
            </Text>
          </View>
          {dateItems.map(item => (
            <View
              key={item.id}
              className="flex-row justify-between items-center ml-6 mb-1.5"
            >
              <View className="flex-1">
                <Text className="text-gray-700 font-semibold text-sm">
                  {item.meal.title} × {item.quantity}
                </Text>
                <Text className="text-gray-500 text-sm">
                  {item.kitchenName} • {item.meal.mealTime}
                </Text>
              </View>
              <Text className="text-gray-600 text-sm">
                ₹{(item.meal.price * item.quantity).toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  )
}

export function CartScheduleScreen({
  navigation
}: ApplicationScreenProps<'CartSchedule'>) {
  const { items, clearCart } = useCartStore()
  const { user } = useAppStore()
  const queryClient = useQueryClient()

  const { mutate: saveMeal, isPending: isScheduling } = useSaveMeal({
    onError(error) {
      Toast.show({
        type: 'error',
        text1: 'Scheduling Failed',
        text2: error
      })
    },
    onSuccess({ message }) {
      // Invalidate all relevant queries
      void queryClient.refetchQueries({ queryKey: ['kitchens-meals'] })
      void queryClient.refetchQueries({ queryKey: ['scheduled-orders'] })
      void queryClient.refetchQueries({ queryKey: ['upcoming-meals'] })
      void queryClient.refetchQueries({ queryKey: ['order-history'] })
      void queryClient.refetchQueries({ queryKey: ['wallet-details'] })
      void queryClient.refetchQueries({ queryKey: ['wallet-transactions'] })

      // Clear cart after successful scheduling
      clearCart()

      Toast.show({
        type: 'success',
        text1: 'Meals Scheduled!',
        text2: message || 'Your meals have been scheduled successfully'
      })

      // Navigate to Food screen
      navigation.navigate('Dashboard', { screen: 'Food' })
    }
  })

  const ordersByKitchen = useMemo(() => {
    const grouped = items.reduce((acc, item) => {
      if (!acc[item.kitchenId]) {
        acc[item.kitchenId] = {
          kitchenId: item.kitchenId,
          mealScheduleId: item.mealScheduleId,
          kitchenName: item.kitchenName,
          items: []
        }
      }
      acc[item.kitchenId].items.push(item)
      return acc
    }, {} as Record<string, { kitchenId: string; mealScheduleId: string; kitchenName: string; items: CartItem[] }>)

    return Object.values(grouped)
  }, [items])

  const totalAmount = useMemo(() => {
    return items.reduce(
      (total, item) => total + item.meal.price * item.quantity,
      0
    )
  }, [items])

  const totalItems = useMemo(() => {
    return items.reduce((count, item) => count + item.quantity, 0)
  }, [items])

  const handleScheduleConfirm = useCallback(() => {
    if (!user?._id) {
      Toast.show({
        type: 'error',
        text1: 'Authentication Error',
        text2: 'Please log in to schedule meals'
      })
      return
    }

    Alert.alert(
      'Confirm Schedule',
      `This will schedule ${totalItems} meals for a total of ₹${totalAmount}. This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            // Process each kitchen
            const orders = ordersByKitchen.flatMap(
              ({ kitchenId, mealScheduleId, items: kitchenItems }) => {
                // Group items by date for this kitchen
                const ordersByDate = kitchenItems.reduce((acc, item) => {
                  if (!acc[item.date]) {
                    acc[item.date] = []
                  }
                  acc[item.date].push(item)
                  return acc
                }, {} as Record<string, CartItem[]>)

                // Create orders array for this kitchen
                const orders = Object.entries(ordersByDate).map(
                  ([date, dateItems]) => ({
                    kitchen: kitchenId,
                    mealScheduleId,
                    items: dateItems.map(item => ({
                      meal: item.mealId,
                      count: item.quantity,
                      mealTime: item.meal.mealTime
                    })),
                    deliveryDate: date
                  })
                )

                return orders
              }
            )

            saveMeal({
              orderBy: user._id,
              addNew: { orders }
            })
          }
        }
      ]
    )
  }, [
    user?._id,
    totalItems,
    items.length,
    totalAmount,
    ordersByKitchen,
    saveMeal
  ])

  return (
    <SafeScreen className="px-0">
      <View className="flex-row items-center justify-between pb-1.5 px-4">
        <Pressable onPress={() => navigation.goBack()} className="p-2 -ml-2">
          <ArrowLeft size={24} color="#374151" />
        </Pressable>
        <Text className="font-bold text-lg text-gray-900">Schedule Meals</Text>
        <View className="w-8" />
      </View>

      <ScrollView
        className="flex-1  pt-2.5 px-4"
        showsVerticalScrollIndicator={false}
      >
        <ScheduleSummary items={items} />
        {ordersByKitchen.map(
          ({ kitchenId, kitchenName, items: kitchenItems }, i) => (
            <View
              key={kitchenId}
              className="bg-white rounded-lg px-4 pt-4 pb-2 mb-2.5 shadow-sm border border-y-gray-100 border-r-gray-100 border-l-4 border-brand"
            >
              <Text className="font-bold text-base text-gray-900 mb-2">
                {kitchenName}
              </Text>
              {kitchenItems.map(item => (
                <View
                  key={item.id}
                  className="flex-row justify-between items-center pb-2"
                >
                  <View className="flex-1">
                    <Text className="font-medium text-gray-900">
                      {item.meal.title}
                    </Text>
                    <View className="flex-row items-center">
                      <Text className="text-gray-500 text-sm">
                        {new Date(item.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </Text>
                      <Text className="text-gray-400 mx-2">•</Text>
                      <Text className="text-gray-500 text-sm capitalize">
                        {item.meal.mealTime}
                      </Text>
                      <Text className="text-gray-400 mx-2">•</Text>
                      <Text className="text-gray-500 text-sm">
                        Qty: {item.quantity}
                      </Text>
                    </View>
                  </View>
                  <Text className="font-semibold text-gray-900">
                    ₹{(item.meal.price * item.quantity).toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>
          )
        )}
        <View className="bg-blue-50 rounded-lg p-4 border border-blue-200 mt-auto">
          <Text className="font-semibold text-blue-900 mb-2">
            Important Notes:
          </Text>
          <Text className="text-blue-800 text-sm leading-5">
            • Meals will be scheduled for the selected dates and times{'\n'}•
            You can modify or cancel meals before preparation starts{'\n'}•
            Payment will be processed from your wallet{'\n'}• You'll receive
            notifications about meal preparation and delivery
          </Text>
        </View>
        <View className="h-6" />
      </ScrollView>

      <View className="bg-white border-t border-gray-200 p-4">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-gray-600 text-sm">
              {totalItems} meals • {ordersByKitchen.length} kitchen(s)
            </Text>
            <Text className="text-xl font-bold text-gray-900">
              ₹{totalAmount.toLocaleString()}
            </Text>
          </View>
        </View>
        <Button
          onPress={handleScheduleConfirm}
          disabled={isScheduling}
          className="w-full bg-brand rounded-xl"
        >
          <Text className="text-white font-semibold text-base">
            {isScheduling ? 'Scheduling...' : 'Confirm & Schedule'}
          </Text>
        </Button>
      </View>
    </SafeScreen>
  )
}
