import { QueryOptions, useQuery } from '@tanstack/react-query'

import { axios, IApiError, IApiResponse } from '@/lib/axios'
import { useAppStore } from '@/lib/store/useAppStore'

export interface Menu {
  _id: string
  name: string
  mealItems: MealItem[]
  images: string[]
  kitchen: string
  mealTime: string[]
  price: number
  mealPreference: string
  mealScheduleId: string
  description: string
  orderCount: number
  customerOrderId: null | string
}

interface MealItem {
  name: string
  units: string
  unitLabel: string
  order: number
  _id: string
}

interface ScheduleMeal {
  date: string
  mealscheduleId: string
  menu: Menu[]
}

interface KitchenMealsData {
  scheduleMeals: ScheduleMeal[]
}

async function getMeals(kitchenId: string, cId: string) {
  const endpoint = `/kitchens/${kitchenId}/mealSchedules?customerId=${cId}`
  const res = await axios.get<IApiResponse<KitchenMealsData>>(endpoint)
  return res.data
}

export const useKitchenMeals = (
  kitchenId: string,
  config: QueryOptions<IApiResponse<KitchenMealsData>, IApiError> = {}
) => {
  const cId = useAppStore(s => s.user?._id || '')
  const query = useQuery({
    queryKey: ['kitchens-meals', kitchenId, cId],
    queryFn: () => getMeals(kitchenId, cId),
    ...config
  })

  return query
}
