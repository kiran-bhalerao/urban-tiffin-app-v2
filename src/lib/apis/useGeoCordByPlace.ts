import { MutateOptions, useMutation } from '@tanstack/react-query'

import { axios, IApiError, IApiResponse } from '@/lib/axios'

export interface GeoCordByPlace {
  description: string
  main_text: string
  place_id: string
  reference: string
}

interface GeoCordByPlaceData {
  location: {
    lat: number
    lng: number
  }
}

interface GeoCordByPlaceParams {
  placeId: string
}

async function searchAddress(params: GeoCordByPlaceParams) {
  const endpoint = '/locations/places/geocode'
  const res = await axios.post<IApiResponse<GeoCordByPlaceData>>(
    endpoint,
    params
  )

  return res.data
}

export const useGeoCordByPlace = (
  config: MutateOptions<
    IApiResponse<GeoCordByPlaceData>,
    IApiError,
    GeoCordByPlaceParams
  > = {}
) => {
  const query = useMutation({
    mutationFn: searchAddress,
    ...config
  })

  return query
}
