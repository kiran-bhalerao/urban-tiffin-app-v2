import { MutateOptions, useMutation } from '@tanstack/react-query'

import { axios, IApiError, IApiResponse } from '@/lib/axios'
import { IUser } from '@/lib/store/useAppStore'
import { type UserAddress } from '@/types/schemas/user'

interface CreateProfileData {
  token: string
  user: IUser
}

interface CreateProfileParams {
  email: string
  name: string
  gender: string | undefined
  dob: string | undefined
  _id: string
  mobile: number
  otp: number
  address: Omit<UserAddress, '_id'>
}

async function createProfile(params: CreateProfileParams) {
  const endpoint = '/auth/customers/signup'
  const res = await axios.post<IApiResponse<CreateProfileData>>(endpoint, {
    service: 'customerSignup',
    ...params
  })

  return res.data
}

export const useCreateProfile = (
  config: MutateOptions<
    IApiResponse<CreateProfileData>,
    IApiError,
    CreateProfileParams
  > = {}
) => {
  const query = useMutation({
    mutationFn: createProfile,
    ...config
  })

  return query
}
