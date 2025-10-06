import { QueryOptions, useQuery } from '@tanstack/react-query'

import { axios, IApiError, IApiResponse } from '@/lib/axios'

export interface GetCalendar {
  _id: string
  name: string
  tags: string[]
  mealItems: { name: string; units: string; unitLabel: string; order: number }[]
  images: string[]
  kitchen: string
  kitchenManager: string
  mealTime: string
  price: number
  mealPreference: string
  cuisine: string
  mealCategories: string[]
  quantity: string
  createdAt: string
  updatedAt: string
}

type GetCalendarData = string[]

async function getCalendar() {
  const endpoint = '/guest/calendar'
  const res = await axios.get<IApiResponse<GetCalendarData>>(endpoint)

  return res.data
}

export const useGetCalendar = (
  config: QueryOptions<IApiResponse<GetCalendarData>, IApiError> = {}
) => {
  const query = useQuery({
    queryKey: ['get-calendar'],
    queryFn: () => getCalendar(),
    ...config
  })

  return query
}
