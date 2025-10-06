import { MutateOptions, useMutation } from '@tanstack/react-query'

import { axios, IApiError, IApiResponse } from '@/lib/axios'

interface CancelMealOrderData {
  deletedOrder: boolean
}

interface CancelMealOrderParams {
  orderBy: string
  orderIds: string[]
}

async function cancelMeal({ orderBy, orderIds }: CancelMealOrderParams) {
  const endpoint = `/customers/${orderBy}/customerOrders`
  const res = await axios.delete<IApiResponse<CancelMealOrderData>>(endpoint, {
    data: { orderIds }
  })

  return res.data
}

export const useCancelMealOrder = (
  config: MutateOptions<
    IApiResponse<CancelMealOrderData>,
    IApiError,
    CancelMealOrderParams
  > = {}
) => {
  const query = useMutation({
    mutationFn: cancelMeal,
    ...config
  })

  return query
}
