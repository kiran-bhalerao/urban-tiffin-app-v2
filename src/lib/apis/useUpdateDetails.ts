import { MutateOptions, useMutation } from '@tanstack/react-query'

import { axios, IApiError, IApiResponse } from '@/lib/axios'
import { type UserAddress } from '@/types/schemas/user'

interface UpdateDetailsData {
  updatedUser?: {
    mobile: number
    name: string
    email: string
    gender: string
    dob: string
    addresses?: UserAddress[]
  }
}

interface UpdateDetailsParams {
  userId: string
  email?: string
  name?: string
  gender?: string
  dob?: string
  address?: {
    add?: Omit<UserAddress, '_id'>
    update?: UserAddress
    remove?: string[]
    default?: { _id: string }
  }
}

async function updateDetails({ userId, ...params }: UpdateDetailsParams) {
  const endpoint = `/customers/${userId}`
  const res = await axios.patch<IApiResponse<UpdateDetailsData>>(
    endpoint,
    params
  )

  return res.data
}

export const useUpdateDetails = (
  config: MutateOptions<
    IApiResponse<UpdateDetailsData>,
    IApiError,
    UpdateDetailsParams
  > = {}
) => {
  const query = useMutation({
    mutationFn: updateDetails,
    ...config
  })

  return query
}
