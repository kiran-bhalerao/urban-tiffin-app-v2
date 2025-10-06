import {
  InfiniteData,
  QueryKey,
  UndefinedInitialDataInfiniteOptions,
  useInfiniteQuery
} from '@tanstack/react-query'

import { axios, IApiError, IApiResponse } from '@/lib/axios'

export interface SearchKitchen {
  _id: string
  name: string
  bId: string
  description: string
  tags: string[]
  images: string[]
  address: string
  kitchenHub: string
  rating: number
  fssai?: number
  cuisines: string[]
  dietaryTypes: string[]
  active: boolean
  contacts: string[]
  createdAt: string
  updatedAt: string
  kitchenManager: string
}

interface SearchData {
  kitchens: SearchKitchen[]
  nextPage: number
}

interface SearchDataParams {
  text: string
  mealPreference?: string
  location?: {
    lat: number
    lng: number
  }
}

async function searchKitchen(params: SearchDataParams, size: number, page = 1) {
  const endpoint = '/kitchens/search'
  const res = await axios.post<IApiResponse<SearchData>>(
    endpoint,
    {
      searchType: 'kitchen',
      ...params
    },
    { params: { page, limit: size } }
  )

  return {
    ...res.data,
    nextPage: res.data.data.kitchens.length ? page + 1 : undefined
  }
}

export const useSearchKitchen = (
  params: SearchDataParams,
  size = 20,
  config?: UndefinedInitialDataInfiniteOptions<
    IApiResponse<SearchData>,
    IApiError,
    InfiniteData<IApiResponse<SearchData>>,
    QueryKey,
    number
  >
) => {
  const query = useInfiniteQuery({
    queryKey: ['search-kitchen', params, size],
    queryFn: ({ pageParam }) => searchKitchen(params, size, pageParam),
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage.nextPage,
    ...(config || {})
  })

  return query
}
