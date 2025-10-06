import { QueryOptions, useQuery } from '@tanstack/react-query'

import { axios, IApiError, IApiResponse } from '@/lib/axios'

export interface ScheduledOrders {
  _id: string
  date: string
  orders: {
    _id: string
    name: string
    tags: string[]
    mealItems: {
      name: string
      units: string
      unitLabel: string
      order: number
      _id: string
    }[]
    images: string[]
    kitchen: { _id: string; name: string }
    kitchenManager: string
    mealTime: string
    price: number
    mealPreference: string
    cuisine: string
    mealCategories: string[]
    quantity: number
    createdAt: string
    updatedAt: string
  }[]
}

interface ScheduledOrdersData {
  customerOrders: ScheduledOrders[]
}

interface ScheduledOrdersParams {
  startDate: string
  endDate: string
}

async function fetchOrders(userId: string, params: ScheduledOrdersParams) {
  const endpoint = `/customers/${userId}/currentOrders`
  const res = await axios.get<IApiResponse<ScheduledOrdersData>>(endpoint, {
    params
  })

  return res.data
}

export const useScheduledOrders = (
  userId: string | undefined,
  params: ScheduledOrdersParams,
  config: QueryOptions<IApiResponse<ScheduledOrdersData>, IApiError> = {}
) => {
  const query = useQuery({
    queryKey: ['scheduled-orders', params, userId],
    enabled: !!userId,
    queryFn: () => fetchOrders(userId || '', params),
    ...config
  })

  return query
}
