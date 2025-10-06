import { MutateOptions, useMutation } from '@tanstack/react-query'

import { axios, IApiError, IApiResponse } from '@/lib/axios'
import { IUser } from '@/lib/store/useAppStore'

interface VerifyData {
  token: string
  user: IUser
}

interface VerifyOtpParams {
  _id: string
  mobile: number
  otp: number
}

async function verifyOtp(params: VerifyOtpParams) {
  const endpoint = '/auth/customers/login'
  const res = await axios.post<IApiResponse<VerifyData>>(endpoint, {
    service: 'customerLogin',
    ...params
  })

  return res.data
}

export const useVerifyOtp = (
  config: MutateOptions<
    IApiResponse<VerifyData>,
    IApiError,
    VerifyOtpParams
  > = {}
) => {
  const query = useMutation({
    mutationFn: verifyOtp,
    ...config
  })

  return query
}
