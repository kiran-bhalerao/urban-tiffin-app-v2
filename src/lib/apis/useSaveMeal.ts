import { MutateOptions, useMutation } from '@tanstack/react-query'

import { axios, IApiError, IApiResponse } from '@/lib/axios'

interface SaveMealData {
  token: string
}

interface SaveMealParams {
  orderBy: string
  addNew: {
    orders: Order[]
  }
}

export interface Order {
  kitchen: string
  mealScheduleId: string
  items: Item[]
  deliveryDate: string
}

export interface Item {
  meal: string
  count: number
}

async function saveMeal(params: SaveMealParams) {
  const endpoint = `/customers/${params.orderBy}/customerOrders`
  const res = await axios.patch<IApiResponse<SaveMealData>>(endpoint, params)

  return res.data
}

export const useSaveMeal = (
  config: MutateOptions<
    IApiResponse<SaveMealData>,
    IApiError,
    SaveMealParams
  > = {}
) => {
  const query = useMutation({
    mutationFn: saveMeal,
    ...config
  })

  return query
}
