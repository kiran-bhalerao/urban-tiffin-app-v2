import { MutateOptions, useMutation } from '@tanstack/react-query'

import { axios, IApiError, IApiResponse } from '@/lib/axios'

interface ModifyMealOrderData {
  modifiedOrder: boolean
}

interface ModifyMealOrderParams {
  orderBy: string
  update: {
    meal: string
    count: number
    customerOrderId: string
  }[]
}

async function modifyMeal({ orderBy, update }: ModifyMealOrderParams) {
  const endpoint = `/customers/${orderBy}/customerOrders`
  const res = await axios.patch<IApiResponse<ModifyMealOrderData>>(endpoint, {
    orderBy,
    update
  })

  return res.data
}

export const useModifyMealOrder = (
  config: MutateOptions<
    IApiResponse<ModifyMealOrderData>,
    IApiError,
    ModifyMealOrderParams
  > = {}
) => {
  const query = useMutation({
    mutationFn: modifyMeal,
    ...config
  })

  return query
}
