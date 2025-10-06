export interface UserAddress {
  _id: string
  location?: {
    type: 'Point'
    coordinates: [number, number]
  }
  rawAddress: string
  houseNo: string
  city: string
  state: string
  pincode: string
  landmark: string
  isDefault?: boolean
  saveAsTag?: string
}
