import { MutateOptions, useMutation } from '@tanstack/react-query'

import { axios, IApiError, IApiResponse } from '@/lib/axios'

interface OtpData {
  _id: string
  mobile: number
  service: string
  __v: number
  createdAt: string
  expireAt: string
  otp: number
  updatedAt: string
  user: boolean
}

async function genOtp(mobile: string) {
  const endpoint = '/auth/getOtp'
  const res = await axios.post<IApiResponse<OtpData>>(endpoint, {
    userType: 'customer',
    mobile,
    service: 'customerLogin'
  })

  return res.data
}

export const useGenOtp = (
  config: MutateOptions<
    IApiResponse<OtpData>,
    IApiError,
    { mobile: string }
  > = {}
) => {
  const query = useMutation({
    mutationFn: ({ mobile }) => genOtp(mobile),
    retry: false,
    ...config
  })

  return query
}
