/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable func-names */
import ax from 'axios'

import { useAppStore } from '@/lib/store/useAppStore'

export type IApiError<T = string> = T
export interface IApiResponse<T> {
  statusCode: number
  error: boolean
  message: string
  data: T
  nextPage?: number
}

export const BASE_PATH = 'https://Api.Urbantiffin.in/v1'

export const axios = ax.create({
  baseURL: BASE_PATH
})

axios.interceptors.request.use(function (config) {
  const token = useAppStore.getState().accessToken

  if (config.headers) {
    config.headers['x-access-token'] = token
  }

  return config
})

axios.interceptors.response.use(
  function (res) {
    return res
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(
      error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        'Something went wrong!'
    )
  }
)
