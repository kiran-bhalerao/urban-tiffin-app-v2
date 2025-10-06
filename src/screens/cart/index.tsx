import React, { useCallback, useMemo } from 'react'
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  View
} from 'react-native'
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Trash2
} from 'lucide-react-native'
import Toast from 'react-native-toast-message'

import { Button } from '@/components/reusables/ui/button'
import { Text } from '@/components/reusables/ui/text'
import { SafeScreen } from '@/components/template'
import { useCartStore, type CartItem } from '@/lib/store/useCartStore'
import { cn } from '@/lib/utils'
import type { ApplicationScreenProps } from '@/types/navigation'
import { useAppStore } from '@/lib/store/useAppStore'
import { useQueryClient } from '@tanstack/react-query'
import { useSaveMeal } from '@/lib/apis/useSaveMeal'

interface CartItemComponentProps {
  item: CartItem
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemove: (itemId: string) => void
}

const CartItemComponent: React.FC<CartItemComponentProps> = ({
  item,
  onUpdateQuantity,
  onRemove
}) => {
  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1)
    } else {
      onRemove(item.id)
    }
  }

  const handleIncrease = () => {
    onUpdateQuantity(item.id, item.quantity + 1)
  }

  const handleRemove = () => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => onRemove(item.id)
        }
      ]
    )
  }

  return (
    <View className="bg-white rounded-lg p-4 mb-2 shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-start mb-1.5">
        <View className="flex-1 mr-3">
          <Text className="font-semibold text-gray-900 text-base">
            {item.meal.title}
          </Text>
          <View className="flex-row items-center mt-2">
            <View
              className={cn(
                'px-2 py-1 rounded-full mr-2',
                item.meal.mealPreference === 'VEG'
                  ? 'bg-green-100'
                  : 'bg-red-100'
              )}
            >
              <Text
                className={cn(
                  'text-xs font-semibold',
                  item.meal.mealPreference === 'VEG'
                    ? 'text-green-700'
                    : 'text-red-700'
                )}
              >
                {item.meal.mealPreference === 'VEG' ? 'VEG' : 'NON-VEG'}
              </Text>
            </View>
            <Text className="text-gray-500 text-sm capitalize">
              {item.meal.mealTime}
            </Text>
          </View>
        </View>
        <Pressable onPress={handleRemove} className="p-1">
          <Trash2 size={18} color="#ef4444" />
        </Pressable>
      </View>

      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-gray-500 text-sm">
            {new Date(item.date).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            })}
          </Text>
          <Text className="font-semibold text-lg text-gray-900">
            ₹{(item.meal.price * item.quantity).toLocaleString()}
          </Text>
        </View>

        <View className="flex-row items-center bg-brand rounded-lg">
          <Pressable
            onPress={() => {
              if (item.quantity === 1) {
                handleRemove()
              } else {
                handleDecrease()
              }
            }}
            className="py-1.5 px-2 rounded-l-lg"
          >
            <Minus size={14} color="#fff" />
          </Pressable>
          <Text className="px-2 py-1.5 font-semibold text-white">
            {item.quantity}
          </Text>
          <Pressable
            onPress={handleIncrease}
            className="py-1.5 px-2 rounded-r-lg"
          >
            <Plus size={14} color="#fff" />
          </Pressable>
        </View>
      </View>
    </View>
  )
}

interface KitchenSectionProps {
  kitchenName: string
  items: CartItem[]
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemove: (itemId: string) => void
}

const KitchenSection: React.FC<KitchenSectionProps> = ({
  kitchenName,
  items,
  onUpdateQuantity,
  onRemove
}) => {
  const kitchenTotal = items.reduce(
    (total, item) => total + item.meal.price * item.quantity,
    0
  )

  return (
    <View className="mb-2">
      <View className="flex-row justify-between items-center mb-1.5 px-1">
        <Text className="font-semibold text-lg text-gray-900">
          {kitchenName}
        </Text>
        <Text className="font-semibold text-gray-700">
          ₹{kitchenTotal.toLocaleString()}
        </Text>
      </View>
      {items.map(item => (
        <CartItemComponent
          key={item.id}
          item={item}
          onUpdateQuantity={onUpdateQuantity}
          onRemove={onRemove}
        />
      ))}
    </View>
  )
}

export function CartScreen({ navigation }: ApplicationScreenProps<'Cart'>) {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount
  } = useCartStore()
  const { user } = useAppStore()
  const queryClient = useQueryClient()

  const itemsByKitchen = useMemo(() => {
    const grouped = items.reduce((acc, item) => {
      if (!acc[item.kitchenId]) {
        acc[item.kitchenId] = {
          kitchenName: item.kitchenName,
          items: []
        }
      }
      acc[item.kitchenId].items.push(item)
      return acc
    }, {} as Record<string, { kitchenName: string; items: CartItem[] }>)

    return Object.entries(grouped).map(([kitchenId, data]) => ({
      kitchenId,
      ...data
    }))
  }, [items])

  const totalAmount = getCartTotal()
  const totalItems = getCartItemCount()

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

  const handleScheduleAll = useCallback(() => {
    if (items.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Empty Cart',
        text2: 'Please add some meals to your cart first'
      })
      return
    }

    handleScheduleConfirm()
  }, [items.length, navigation])

  const handleClearCart = useCallback(() => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            clearCart()
            Toast.show({
              type: 'success',
              text1: 'Cart Cleared',
              text2: 'All items have been removed from your cart'
            })
          }
        }
      ]
    )
  }, [clearCart])

  if (items.length === 0) {
    return (
      <SafeScreen>
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Pressable
              onPress={() => navigation.goBack()}
              className="p-2 -ml-2"
            >
              <ArrowLeft size={24} color="#374151" />
            </Pressable>
            <Text className="font-bold text-lg text-gray-900">Cart</Text>
            <View className="w-8" />
          </View>
          <View className="flex-1 justify-center items-center px-8">
            <ShoppingCart size={80} color="#d1d5db" />
            <Text className="text-xl font-semibold text-gray-900 mt-4 text-center">
              Your cart is empty
            </Text>
            <Text className="text-gray-600 mt-2 text-center">
              Add some delicious meals to get started
            </Text>
            <Button
              onPress={() =>
                navigation.navigate('Dashboard', { screen: 'Home' })
              }
              className="mt-6 rounded-xl bg-brand"
            >
              <Text className="text-white font-semibold">Browse Kitchens</Text>
            </Button>
          </View>
        </View>
      </SafeScreen>
    )
  }

  return (
    <SafeScreen className="px-0">
      <View className="flex-row items-center justify-between pb-1.5 px-4">
        <Pressable onPress={() => navigation.goBack()} className="p-2 -ml-2">
          <ArrowLeft size={24} color="#374151" />
        </Pressable>
        <Text className="font-bold text-lg text-gray-900">
          Cart ({totalItems} items)
        </Text>
        <Pressable onPress={handleClearCart} className="p-2 -mr-2">
          <Text className="text-red-600 font-medium">Clear</Text>
        </Pressable>
      </View>

      <ScrollView
        className="flex-1 pt-2.5 px-4"
        showsVerticalScrollIndicator={false}
      >
        {itemsByKitchen.map(kitchen => (
          <KitchenSection
            key={kitchen.kitchenId}
            kitchenName={kitchen.kitchenName}
            items={kitchen.items}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
          />
        ))}
      </ScrollView>

      {/* Bottom Summary */}
      <View className="bg-white border-t border-gray-200 p-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-semibold text-gray-900">
            Total Amount
          </Text>
          <Text className="text-xl font-bold text-gray-900">
            ₹{totalAmount.toLocaleString()}
          </Text>
        </View>
        <Button
          onPress={handleScheduleAll}
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
