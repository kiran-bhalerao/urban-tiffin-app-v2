import { useCallback, useMemo } from 'react'
import { Alert } from 'react-native'
import Toast from 'react-native-toast-message'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { useCartStore } from '@/lib/store/useCartStore'
import { ApplicationStackParamList } from '@/types/navigation'
import { IMeal } from './useMeals'

interface UseCartIntegrationProps {
  kitchenId: string
  mealScheduleId: string
  kitchenName: string
  savedMeals: Record<string, Array<{ meal: IMeal; count: number }>>
}

export const useCartIntegration = ({
  kitchenId,
  kitchenName,
  savedMeals,
  mealScheduleId
}: UseCartIntegrationProps) => {
  const { navigate } =
    useNavigation<NavigationProp<ApplicationStackParamList>>()
  const { addToCart, getCartItemCount, hasItemsForKitchen } = useCartStore()

  const totalCartItems = getCartItemCount()
  const hasKitchenItemsInCart = hasItemsForKitchen(kitchenId)

  const selectedMealsCount = useMemo(() => {
    return Object.values(savedMeals).reduce((total, meals) => {
      return (
        total + meals.reduce((mealTotal, meal) => mealTotal + meal.count, 0)
      )
    }, 0)
  }, [savedMeals])

  const hasSelectedMeals = selectedMealsCount > 0

  const addMealsToCart = useCallback(() => {
    if (!hasSelectedMeals) {
      Toast.show({
        type: 'error',
        text1: 'No Meals Selected',
        text2: 'Please select some meals first'
      })
      return
    }

    let addedCount = 0

    // Convert savedMeals to cart items
    Object.entries(savedMeals).forEach(([date, meals]) => {
      meals.forEach(({ meal, count }) => {
        if (count > 0) {
          addToCart({
            mealId: meal.id,
            kitchenId,
            mealScheduleId,
            kitchenName,
            meal: {
              title: meal.title,
              price: meal.price,
              description: meal.description,
              mealTime: meal._mealTime,
              mealPreference: meal.mealPreference || 'veg'
            },
            date,
            quantity: count
          })
          addedCount += count
        }
      })
    })

    Toast.show({
      type: 'success',
      text1: 'Added to Cart',
      text2: `${addedCount} meal(s) added to your cart`
    })

    // Navigate to cart
    navigate('Cart')
  }, [
    savedMeals,
    hasSelectedMeals,
    addToCart,
    kitchenId,
    kitchenName,
    navigate
  ])

  const showAddToCartConfirmation = useCallback(() => {
    const totalMeals = selectedMealsCount
    const totalDays = Object.keys(savedMeals).filter(date =>
      savedMeals[date].some(meal => meal.count > 0)
    ).length

    Alert.alert(
      'Add to Cart',
      `Add ${totalMeals} meal(s) for ${totalDays} day(s) to your cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Add to Cart', onPress: addMealsToCart }
      ]
    )
  }, [selectedMealsCount, savedMeals, addMealsToCart])

  const goToCart = useCallback(() => {
    navigate('Cart')
  }, [navigate])

  return {
    totalCartItems,
    hasKitchenItemsInCart,
    selectedMealsCount,
    hasSelectedMeals,
    addMealsToCart: showAddToCartConfirmation,
    goToCart
  }
}
