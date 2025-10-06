import { QueryOptions, useQuery } from '@tanstack/react-query'

import { axios, IApiError, IApiResponse } from '@/lib/axios'

interface Chef {
  _id: string
  name: string
  profilePic: string
  email: string
  mobile: number
  gender: string
  kitchen: {
    _id: string
    name: string
    images: string[]
    address: {
      locationName: string
      locationType: string
      rawAddress: string
      city: string
      state: string
      country: string
      pincode: string
      createdAt: string
      updatedAt: string
    }
    rating: number
    active: boolean
    fssaiNo: string
    fssaiCertificate: string
  }
  mobileVerified: boolean
  emailVerified: boolean
  active: boolean
  createdAt: string
  updatedAt: string
}

interface KitchenDetailsData {
  chef: Chef
}

async function getKitchenDetails(kitchenId: string, kitchenManager: string) {
  const endpoint = `/kitchens/${kitchenId}/kitchenManagers/${kitchenManager}`
  const res = await axios.get<IApiResponse<KitchenDetailsData>>(endpoint)
  return res.data
}

export const useKitchenDetails = (
  kitchenId: string,
  kitchenManager: string,
  config: QueryOptions<IApiResponse<KitchenDetailsData>, IApiError> = {}
) => {
  const query = useQuery({
    queryKey: ['kitchens-details', kitchenId],
    queryFn: () => getKitchenDetails(kitchenId, kitchenManager),
    ...config
  })

  return query
}
