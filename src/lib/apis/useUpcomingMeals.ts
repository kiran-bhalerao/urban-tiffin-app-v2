import { QueryOptions, useQuery } from '@tanstack/react-query'

import { axios, IApiError, IApiResponse } from '@/lib/axios'

export interface UpcomingMeals {
  title: string
  deliveryDate: string
  kitchen: {
    _id: string
    name: string
  }
  meals: {
    name: string
    quantity: number
    mealPreference: string
    mealTime: string
    image?: string
    deliveryStatus: string
  }[]
}

interface UpcomingMealsData {
  upcomingOrders: UpcomingMeals[]
}

export async function fetchUpcomingMeals(userId: string) {
  const endpoint = `/customers/${userId}/upcomingOrders`
  // await new Promise(r => {
  //   setTimeout(r, 5000)
  // })
  const res = await axios.get<IApiResponse<UpcomingMealsData>>(endpoint)

  return res.data
}

export const useUpcomingMeal = (
  userId: string | undefined,
  config: QueryOptions<IApiResponse<UpcomingMealsData>, IApiError> = {}
) => {
  const query = useQuery({
    queryKey: ['upcoming-meals', userId],
    enabled: !!userId,
    queryFn: () => fetchUpcomingMeals(userId || ''),
    ...config
  })

  return query
}
