import { MutateOptions, useMutation } from '@tanstack/react-query'

import { axios, IApiError, IApiResponse } from '@/lib/axios'

interface SaveFcmTokenData {
  token: string
}

interface SaveFcmTokenParams {
  firebaseToken: string
  customerId: string
}

async function saveFcmToken(params: SaveFcmTokenParams) {
  const endpoint = '/firebase/tokens/create'
  const res = await axios.post<IApiResponse<SaveFcmTokenData>>(endpoint, params)

  return res.data
}

export const useSaveFcmToken = (
  config: MutateOptions<
    IApiResponse<SaveFcmTokenData>,
    IApiError,
    SaveFcmTokenParams
  > = {}
) => {
  const query = useMutation({
    mutationFn: saveFcmToken,
    ...config
  })

  return query
}
