import { MutateOptions, useMutation } from '@tanstack/react-query'

import { axios, IApiError, IApiResponse } from '@/lib/axios'

interface WalletWithdrawParams {
  userId: string
}

type WalletWithdrawData = { wallet?: any }

async function withdraw({ userId }: WalletWithdrawParams) {
  const endpoint = '/payments/wallets/withdraw'
  const res = await axios.post<IApiResponse<WalletWithdrawData>>(endpoint, {
    customerId: userId,
    withdrawSource: 'upi'
  })

  return res.data
}

export const useWalletWithdraw = (
  config: MutateOptions<
    IApiResponse<WalletWithdrawData>,
    IApiError,
    WalletWithdrawParams
  > = {}
) => {
  const query = useMutation({
    mutationFn: withdraw,
    ...config
  })

  return query
}
