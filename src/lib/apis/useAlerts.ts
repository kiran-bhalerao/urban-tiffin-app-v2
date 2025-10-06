import {
  InfiniteData,
  QueryKey,
  UndefinedInitialDataInfiniteOptions,
  useInfiniteQuery
} from '@tanstack/react-query'

import { axios, IApiError, IApiResponse } from '@/lib/axios'

export interface Alerts {
  _id: string
  title: string
  description: string
  attachment: string
  viewed: boolean
  customer: string
  kitchenManager: string
  alertFor: string
  kitchen: string
  toNotify: boolean
  date: string
  notification: {
    method: string
    sent: boolean
  }
  createdAt: string
  updatedAt: string
}

interface AlertsData {
  alerts: Alerts[]
}

async function getAlerts(userId = '', page = 1) {
  const endpoint = `/customers/${userId}/alerts`
  // await new Promise(r => {
  //   setTimeout(r, 5000)
  // })
  const res = await axios.get<IApiResponse<AlertsData>>(endpoint, {
    params: { page, limit: 10 }
  })

  return {
    ...res.data,
    nextPage: res.data.data.alerts.length ? page + 1 : undefined
  }
}

export const useAlerts = (
  userId: string | undefined,
  config?: UndefinedInitialDataInfiniteOptions<
    IApiResponse<AlertsData>,
    IApiError,
    InfiniteData<IApiResponse<AlertsData>>,
    QueryKey,
    number
  >
) => {
  const query = useInfiniteQuery({
    queryKey: ['users-alerts'],
    queryFn: ({ pageParam }) => getAlerts(userId, pageParam),
    initialPageParam: 1,
    enabled: !!userId,
    getNextPageParam: lastPage => lastPage.nextPage,
    ...(config || {})
  })

  return query
}
