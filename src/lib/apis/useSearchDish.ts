import {
  InfiniteData,
  QueryKey,
  UndefinedInitialDataInfiniteOptions,
  useInfiniteQuery
} from '@tanstack/react-query'

import { axios, IApiError, IApiResponse } from '@/lib/axios'

export interface SearchDish {
  _id: string
  name: string
  tags: string[]
  mealItems: { name: string; units: string; unitLabel: string; order: number }[]
  images: string[]
  kitchen: { _id: string; name: string; rating: number; fssai?: number }[]
  kitchenManager: string
  mealTime: string
  price: number
  mealPreference: string
  cuisine: string
  mealCategories: string[]
  quantity: string
  createdAt: string
  updatedAt: string
}

interface SearchData {
  meals: SearchDish[]
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

async function searchDish(params: SearchDataParams, size: number, page = 1) {
  const endpoint = '/kitchens/search'
  const res = await axios.post<IApiResponse<SearchData>>(
    endpoint,
    {
      searchType: 'meals',
      ...params
    },
    { params: { page, limit: size } }
  )

  return {
    ...res.data,
    nextPage: res.data.data.meals.length ? page + 1 : undefined
  }
}

export const useSearchDish = (
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
    queryKey: ['search-dish', params, size],
    queryFn: ({ pageParam }) => searchDish(params, size, pageParam),
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage.nextPage,
    ...(config || {})
  })

  return query
}
