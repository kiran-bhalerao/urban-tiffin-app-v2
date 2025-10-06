import { MutateOptions, useMutation } from '@tanstack/react-query'

import { axios, IApiError, IApiResponse } from '@/lib/axios'

interface DeleteAccountData {
  deletedOrder: boolean
}

interface DeleteAccountParams {
  userId: string
}

async function deleteAccount({ userId }: DeleteAccountParams) {
  const endpoint = `/customers/${userId}/account`
  const res = await axios.delete<IApiResponse<DeleteAccountData>>(endpoint)

  return res.data
}

export const useDeleteAccount = (
  config: MutateOptions<
    IApiResponse<DeleteAccountData>,
    IApiError,
    DeleteAccountParams
  > = {}
) => {
  const query = useMutation({
    mutationFn: deleteAccount,
    ...config
  })

  return query
}
