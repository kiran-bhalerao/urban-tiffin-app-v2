import { QueryOptions, useQuery } from '@tanstack/react-query'

import { axios, IApiError, IApiResponse } from '@/lib/axios'

interface Address {
  _id: string
  rawAddress: string
  houseNo: string
  city: string
  state: string
  pincode: string
  landmark: string
}

type SavedAddressesData = { addresses: Address[] }

async function getCalendar(userId = '') {
  const endpoint = `/customers/${userId}/addresses`
  const res = await axios.get<IApiResponse<SavedAddressesData>>(endpoint)

  return res.data
}

export const useSavedAddresses = (
  userId: string | undefined,
  config: QueryOptions<IApiResponse<SavedAddressesData>, IApiError> = {}
) => {
  const query = useQuery({
    queryKey: ['saved-addresses'],
    queryFn: () => getCalendar(userId),
    enabled: !!userId,
    ...config
  })

  return query
}
