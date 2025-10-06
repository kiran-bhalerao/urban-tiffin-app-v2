import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { persistConfig } from '@/lib/store/config'
import { UserAddress } from '@/types/schemas/user'

export interface IUser {
  _id: string
  mobile: number
  name: string
  email: string
  gender: string
  dob: string
  address: UserAddress[]
}
interface AppState {
  user: undefined | IUser
  accessToken: string | undefined
  setAccessToken: (accessToken: AppState['accessToken']) => void
  setUser: (user: AppState['user']) => void
  logout: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    set => ({
      user: undefined,
      accessToken: undefined,
      setAccessToken: accessToken => set(state => ({ accessToken })),
      setUser: user => set(state => ({ user })),
      logout: () => {
        set(_ => ({ accessToken: undefined, user: undefined }))
      }
    }),
    persistConfig
  )
)
