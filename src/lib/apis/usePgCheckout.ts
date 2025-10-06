import { MutateOptions, useMutation } from '@tanstack/react-query'

import { axios, IApiError, IApiResponse } from '@/lib/axios'

interface PgCheckoutData {
  checksum: string
  payload_main: string
  merchant_id: string
  environment: 'SANDBOX' | 'PRODUCTION'
}

interface PgCheckoutArgs {
  amount: number
  customerId: string
}

async function getPgCheckout(args: PgCheckoutArgs) {
  const endpoint = '/payments/pg/checkout'
  const res = await axios.post<IApiResponse<PgCheckoutData>>(endpoint, {
    ...args
  })

  return res.data.data
}

export const usePgCheckout = (
  config: MutateOptions<PgCheckoutData, IApiError, PgCheckoutArgs> = {}
) => {
  const query = useMutation({
    mutationFn: args => getPgCheckout(args),
    retry: false,
    ...config
  })

  return query
}
