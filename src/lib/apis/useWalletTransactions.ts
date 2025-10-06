import {
  InfiniteData,
  QueryKey,
  UndefinedInitialDataInfiniteOptions,
  useInfiniteQuery
} from '@tanstack/react-query'

import { axios, IApiError, IApiResponse } from '@/lib/axios'

interface Transaction {
  _id: string
  customerId: string
  wallet: string
  transactionType: string
  paymentStatus: string
  amount: number
  balance: number
  creditSource: string
  createdAt: string
}

type WalletTransactionData = { transactions: Transaction[] }

async function getTransactions(userId = '', page = 1, limit = 10) {
  const endpoint = `/payments/customerTransactions/getDetails?page=${page}&limit=${limit}`
  const res = await axios.post<IApiResponse<WalletTransactionData>>(endpoint, {
    customerId: userId
  })

  return {
    ...res.data,
    nextPage: res.data.data.transactions.length ? page + 1 : undefined
  }
}

export const useWalletTransaction = (
  userId: string | undefined,
  config?: UndefinedInitialDataInfiniteOptions<
    IApiResponse<WalletTransactionData>,
    IApiError,
    InfiniteData<IApiResponse<WalletTransactionData>>,
    QueryKey,
    number
  >
) => {
  const query = useInfiniteQuery({
    queryKey: ['wallet-transactions'],
    queryFn: ({ pageParam }) => getTransactions(userId, pageParam),
    initialPageParam: 1,
    enabled: !!userId,
    getNextPageParam: lastPage => lastPage.nextPage,
    ...(config || {})
  })

  return query
}
