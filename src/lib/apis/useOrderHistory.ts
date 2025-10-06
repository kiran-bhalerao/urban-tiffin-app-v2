import {
  InfiniteData,
  QueryKey,
  UndefinedInitialDataInfiniteOptions,
  useInfiniteQuery
} from '@tanstack/react-query'

import { axios, IApiError, IApiResponse } from '@/lib/axios'

export interface OrderHistory {
  _id: string
  orderBy: string
  orderId: string
  kitchen: {
    _id: string
    name: string
  }
  kitchenHub: string
  items: {
    _id: string
    name: string
    image?: string
    quantity: number
    mealTime: string
    status: string
  }[]
  deliveryDate: string
  orderStatus: string
  createdAt: string
  updatedAt: string
}

interface OrderHistoryData {
  orderHistory: OrderHistory[]
}

async function orderHistory(userId = '', page = 1) {
  const endpoint = `/customers/${userId}/customerOrderHistory`
  const res = await axios.get<IApiResponse<OrderHistoryData>>(endpoint, {
    params: { page, limit: 10 }
  })

  return {
    ...res.data,
    nextPage: res.data.data.orderHistory.length ? page + 1 : undefined
  }
}

export const useOrderHistory = (
  userId: string | undefined,
  config?: UndefinedInitialDataInfiniteOptions<
    IApiResponse<OrderHistoryData>,
    IApiError,
    InfiniteData<IApiResponse<OrderHistoryData>>,
    QueryKey,
    number
  >
) => {
  const query = useInfiniteQuery({
    queryKey: ['order-history'],
    queryFn: ({ pageParam }) => orderHistory(userId, pageParam),
    initialPageParam: 1,
    enabled: !!userId,
    getNextPageParam: lastPage => lastPage.nextPage,
    ...(config || {})
  })

  return query
}
