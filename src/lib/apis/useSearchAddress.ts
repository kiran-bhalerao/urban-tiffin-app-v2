import { MutateOptions, useMutation } from '@tanstack/react-query'

import { axios, IApiError, IApiResponse } from '@/lib/axios'

export interface SearchAddress {
  description: string
  main_text: string
  place_id: string
  reference: string
  country: string
  state: string
  city: string
  landmark: string
}

interface SearchAddressData {
  autocompletedLocations: SearchAddress[]
}

interface SearchAddressParams {
  address: string
  location?: {
    lat: number
    lng: number
  }
}

async function searchAddress(params: SearchAddressParams) {
  const endpoint = '/locations/places/autocomplete'
  const res = await axios.post<IApiResponse<SearchAddressData>>(
    endpoint,
    params
  )

  return res.data
}

export const useSearchAddress = (
  config: MutateOptions<
    IApiResponse<SearchAddressData>,
    IApiError,
    SearchAddressParams
  > = {}
) => {
  const query = useMutation({
    mutationFn: searchAddress,
    ...config
  })

  return query
}
