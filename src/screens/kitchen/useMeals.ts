/* eslint-disable no-restricted-syntax */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useKitchenMeals } from '@/lib/apis/useKitchenMeals'
import { useCartStore } from '@/lib/store/useCartStore'

export interface IMeal {
  id: string
  title: string
  price: number
  customerOrderId: string | null
  description: string
  mealTime: string[]
  _mealTime: string
  mealPreference: string
  orderCount: number
}

export const useMeals = (
  kitchenId: string,
  activeDay: string | undefined,
  tab: 'lunch' | 'dinner'
) => {
  const { data, isFetched } = useKitchenMeals(kitchenId)
  const { getItemsByKitchen, getItemQuantity } = useCartStore()
  const weeksMenuData = useMemo(
    () => data?.data.scheduleMeals || [],
    [data?.data.scheduleMeals]
  )

  const meals = useMemo(
    () => weeksMenuData.find(w => w.date === activeDay)?.menu,
    [activeDay, weeksMenuData]
  )

  const mealScheduleIds = useMemo(
    () =>
      weeksMenuData.reduce(
        (acc, n) => ({ ...acc, [n.date]: n.mealscheduleId }),
        {} as Record<string, string>
      ),
    [weeksMenuData]
  )

  const mealScheduleIdForActiveDay = mealScheduleIds[activeDay ?? '']

  // Optimized meal filtering and transformation
  const { lunchMeals, dinnerMeals } = useMemo(() => {
    if (!meals) {
      return { lunchMeals: [] as IMeal[], dinnerMeals: [] as IMeal[] }
    }

    const transformMeal = (_d: (typeof meals)[0], mealTime: string) => ({
      id: _d._id,
      title: _d.name,
      price: _d.price,
      mealTime: _d.mealTime,
      mealPreference: _d.mealPreference || '', // Ensure mealPreference is always a string
      customerOrderId: _d.customerOrderId,
      _mealTime: mealTime,
      orderCount: 0,
      // orderCount: _d.orderCount || 0,
      description: _d.description || _d.mealItems.map(m => m.name).join(' + ')
    })

    const lunchMeals: IMeal[] = []
    const dinnerMeals: IMeal[] = []

    meals.forEach(_d => {
      const lowerMealTimes = _d.mealTime.map(m => m.toLowerCase())

      if (lowerMealTimes.includes('lunch')) {
        lunchMeals.push(transformMeal(_d, 'lunch'))
      }

      if (lowerMealTimes.includes('dinner')) {
        dinnerMeals.push(transformMeal(_d, 'dinner'))
      }
    })

    return { lunchMeals, dinnerMeals }
  }, [meals])

  const _meals = useMemo(
    () => (tab === 'lunch' ? lunchMeals : dinnerMeals),
    [tab, lunchMeals, dinnerMeals]
  )

  const dates = useMemo(() => {
    return weeksMenuData.map(d => d.date)
  }, [weeksMenuData])

  const [savedMeals, setSavedMeals] = useState<
    Record<string, { meal: IMeal; count: number }[]>
  >({})

  const updateMealCount = useCallback(
    (id: string, by = 1) => {
      if (!activeDay) return

      setSavedMeals(prevSavedMeals => {
        const dayMeals = prevSavedMeals[activeDay] || []
        const mealIndex = dayMeals.findIndex(
          m => m.meal.id === id && m.meal._mealTime === tab
        )

        // Create a copy of the day's meals
        const updatedDayMeals = [...dayMeals]

        if (mealIndex !== -1) {
          // Meal exists, update count
          const newCount = updatedDayMeals[mealIndex].count + by

          if (newCount <= 0) {
            // Remove meal if count is 0 or less
            updatedDayMeals.splice(mealIndex, 1)
          } else {
            // Update count
            updatedDayMeals[mealIndex] = {
              ...updatedDayMeals[mealIndex],
              count: newCount
            }
          }
        } else {
          // Meal doesn't exist, add it if incrementing
          if (by > 0) {
            const meals = tab === 'lunch' ? lunchMeals : dinnerMeals
            const meal = meals.find(m => m.id === id && m._mealTime === tab)

            if (meal) {
              updatedDayMeals.push({ meal, count: by })
            }
          }
        }

        return {
          ...prevSavedMeals,
          [activeDay]: updatedDayMeals
        }
      })
    },
    [activeDay, lunchMeals, dinnerMeals, tab]
  )

  const getMealCount = useCallback(
    (id: string) => {
      if (!activeDay) return 0

      const dayMeals = savedMeals[activeDay] || []
      const meal = dayMeals.find(
        m => m.meal.id === id && m.meal._mealTime === tab
      )

      return meal?.count || 0
    },
    [activeDay, savedMeals, tab]
  )

  const selectedDays = useMemo(() => {
    return Object.entries(savedMeals).reduce((acc, [day, meals]) => {
      // Check if there are any meals with count > 0
      const hasMeals = meals.some(m => m.count > 0)

      if (hasMeals) {
        return {
          ...acc,
          [day]: {
            dinner: meals.some(m => m.meal._mealTime === 'dinner'),
            lunch: meals.some(m => m.meal._mealTime === 'lunch')
          }
        }
      }

      return acc
    }, {} as Record<string, { dinner: boolean; lunch: boolean }>)
  }, [savedMeals])

  return {
    _meals,
    dates,
    isFetched,
    updateMealCount,
    selectedDays,
    getMealCount,
    savedMeals,
    mealScheduleIdForActiveDay
  }
}
