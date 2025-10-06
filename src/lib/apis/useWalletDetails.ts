import { QueryOptions, useQuery } from '@tanstack/react-query'

import { axios, IApiError, IApiResponse } from '@/lib/axios'

interface Wallet {
  _id: string
  balance?: number
}

type WalletDetailsData = { wallet?: Wallet }

async function getDetails(userId = '') {
  const endpoint = '/payments/wallets/getDetails'
  const res = await axios.post<IApiResponse<WalletDetailsData>>(endpoint, {
    customerId: userId
  })

  return res.data
}

export const useWalletDetails = (
  userId: string | undefined,
  config: QueryOptions<IApiResponse<WalletDetailsData>, IApiError> = {}
) => {
  const query = useQuery({
    queryKey: ['wallet-details'],
    queryFn: () => getDetails(userId),
    enabled: !!userId,
    ...config
  })

  return query
}
