import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import type { StackScreenProps } from '@react-navigation/stack'

export type ApplicationStackParamList = {
  Login: undefined
  Otp: { _id: string; mobile: number; isSignup: boolean }
  Dashboard: { screen?: keyof ApplicationTabParamList } | undefined
  Search: undefined | { scheduleDate?: string }
  Kitchen: {
    id: string
    name: string
    rating?: number
    scheduleDate?: string
    kitchenManager: string
  }
  KitchenDetails: {
    id: string
    name: string
    kitchenManager: string
  }
  OrderHistory: undefined
  EditProfile: undefined
  MyAddresses: undefined
  Alerts: undefined
  EditAddress: {
    type?: 'create_profile' | 'save_address'
    place_id?: string
    address_id?: string
    location?: {
      type: 'Point'
      coordinates: [number, number]
    }
    state: string
    city: string
    house?: string
    pincode?: string
    tag?: string
    landmark: string
    rawAddress: string
    profile_data?: {
      email: string
      fullName: string
      gender: string | undefined
      dob: string | undefined
      _id: string
      mobile: number
      otp: number
    }
  }
  YourLocation: {
    email: string
    fullName: string
    gender: string | undefined
    dob: string | undefined
    _id: string
    mobile: number
    otp: number
  }
  CreateProfile: { _id: string; mobile: number; otp: number }
  AdvanceSettings: undefined
  About: undefined
  Help: undefined
  Policy: undefined
  Terms: undefined
  Refund: undefined
  Shipment: undefined
  Cart: undefined
  CartSchedule: undefined
}

export type ApplicationScreenProps<T extends keyof ApplicationStackParamList> =
  StackScreenProps<ApplicationStackParamList, T>

export type ApplicationTabParamList = {
  Home: undefined
  Food: undefined
  Wallet: undefined
  Account: undefined
}

export type ApplicationTabProps<T extends keyof ApplicationTabParamList> =
  BottomTabScreenProps<ApplicationTabParamList, T>
