import { FC, useRef } from 'react'
import { Alert, Pressable, ScrollView, TextInput, View } from 'react-native'
import GetLocation from 'react-native-get-location'
import Toast from 'react-native-toast-message'
import {
  ArrowLeft,
  Building2,
  Edit,
  Home,
  LocateIcon,
  MapPin,
  MoveRight,
  Phone,
  Search,
  Trash2
} from 'lucide-react-native'
import { useDebounceCallback } from 'usehooks-ts'

import { Button } from '@/components/reusables/ui/button'
import { Input } from '@/components/reusables/ui/input'
import { Text } from '@/components/reusables/ui/text'
import { SafeScreen } from '@/components/template'
import { useSearchAddress } from '@/lib/apis/useSearchAddress'
import { useUpdateDetails } from '@/lib/apis/useUpdateDetails'
import { useAppStore } from '@/lib/store/useAppStore'
import { cn } from '@/lib/utils'
import type { ApplicationScreenProps } from '@/types/navigation'

const AddressCard: FC<{
  onPress: () => void
  rawAddress: string
  onEdit?: () => void
  onDelete?: () => void
  isDefault?: boolean
  tag?: string
}> = props => {
  const {
    isDefault = false,
    tag = 'Address',
    onPress,
    rawAddress,
    onEdit,
    onDelete
  } = props

  const mobileNumber = useAppStore(s => s.user?.mobile)

  return (
    <Pressable
      onPress={onPress}
      className={cn('bg-white rounded-xl px-4 py-3 border border-white', {
        'border-brand': isDefault
      })}
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-row gap-2 items-center">
          {tag !== 'office' && tag !== 'home' && (
            <MapPin color="#2B2B2B" size={18} />
          )}
          {tag === 'office' && <Building2 color="#2B2B2B" size={18} />}
          {tag === 'home' && <Home color="#2B2B2B" size={18} />}
          <Text className="font-poppins capitalize text-lg font-medium text-brand-text/90">
            {tag}
          </Text>
        </View>
        {isDefault && (
          <View className="bg-brand/10 rounded-lg px-2 py-1">
            <Text className="font-poppins font-semibold text-xs text-brand">
              DEFAULT
            </Text>
          </View>
        )}
      </View>
      <Text className="font-poppins text-brand-text">{rawAddress}</Text>
      {typeof onDelete === 'function' && (
        <View className="flex flex-row mt-2 items-center justify-between gap-2">
          <View className="flex-row gap-2 items-center">
            <Phone color="#2B2B2B" size={16} />
            <Text className="font-poppins text-brand-text">{mobileNumber}</Text>
          </View>
          <View className="flex flex-row mt-2 items-center gap-4">
            {typeof onEdit === 'function' && (
              <Pressable onPress={onEdit}>
                <Edit size={16} color="#9F56FD" />
              </Pressable>
            )}
            {typeof onDelete === 'function' && !isDefault && (
              <Pressable onPress={onDelete}>
                <Trash2 size={16} color="#D12D2D" />
              </Pressable>
            )}
          </View>
        </View>
      )}
    </Pressable>
  )
}

export function MyAddressesScreen({
  navigation
}: ApplicationScreenProps<'MyAddresses'>) {
  const onCurrentLocationPress = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000
    })
      .then(location => {
        navigation.navigate('EditAddress', {
          state: '',
          rawAddress: '',
          landmark: '',
          city: '',
          location: {
            type: 'Point',
            coordinates: [location.latitude, location.longitude]
          }
        })
      })
      .catch((error: { code: string; message: string }) => {
        const { code, message } = error
        Toast.show({
          type: 'error',
          text1: code,
          text2: message
        })
      })
  }

  const { mutate, data, reset } = useSearchAddress()
  const debounced = useDebounceCallback((address: string) => {
    mutate({ address })
  }, 500)

  const inputRef = useRef<TextInput>(null)
  const user = useAppStore(s => s.user)
  const setUser = useAppStore(s => s.setUser)
  const userId = useAppStore(s => s.user?._id)
  const addresses = useAppStore(s => s.user?.address || [])
  const hasSearched = !!data?.data.autocompletedLocations.length

  const { mutate: updateDetails } = useUpdateDetails({
    onError(error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error
      })
    },
    onSuccess({ message, data: { updatedUser } }, { address = {} }) {
      const types = Object.keys(address)

      Toast.show({
        type: 'success',
        text1: types.includes('remove')
          ? 'Address Removed'
          : types.includes('default')
          ? 'Address changed'
          : 'Address Updated',
        text2: message
      })

      if (user) {
        setUser({ ...user, address: updatedUser?.addresses || user.address })
      }
    }
  })

  return (
    <SafeScreen className="pb-0">
      <View className="flex-1 gap-2">
        <View className="flex-row items-center gap-3">
          <Button
            className="!px-0"
            variant="ghost"
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft color="#000" />
          </Button>
          <Text className="flex-1 text-center mr-8 text-2xl font-poppins">
            My Addresses
          </Text>
        </View>
        <View className="bg-white rounded-xl flex-row items-center pl-4 border border-brand-light-gray/30">
          <Search size={20} color="#FFA922" />
          <Input
            ref={inputRef}
            onChangeText={text => debounced(text)}
            placeholder="Search for area, street name..."
            className="font-poppins border-0 native:h-[48px] text-brand-text flex-1 rounded-xl"
          />
        </View>
        <Pressable
          onPress={onCurrentLocationPress}
          className="flex-row gap-2 justify-between items-center bg-white px-5 py-3.5 rounded-xl"
        >
          <View className="flex-row gap-3">
            <LocateIcon color="#FFA922" size={22} />
            <Text className="font-poppins text-brand font-medium">
              Use current location
            </Text>
          </View>
          <MoveRight color="#FFA922" size={22} />
        </Pressable>
        <View className="bg-brand-violet/20 rounded-md py-1.5 px-2 mt-2">
          <Text className="text-center text-sm text-brand-violet">
            {data?.data.autocompletedLocations.length
              ? 'Addresses near you'
              : 'Saved addresses'}
          </Text>
        </View>
        <View className="py-2 gap-4 flex-1 mt-2">
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="flex-1 gap-3">
              {hasSearched
                ? data?.data.autocompletedLocations.map(d => {
                    return (
                      <AddressCard
                        {...d}
                        rawAddress={d.description}
                        key={d.place_id}
                        onPress={() => {
                          inputRef.current?.clear()
                          reset()
                          navigation.navigate('EditAddress', {
                            place_id: d.place_id,
                            state: d.state,
                            landmark: d.landmark,
                            city: d.city,
                            rawAddress: d.description
                          })
                        }}
                      />
                    )
                  })
                : addresses.map((d, i) => {
                    const house = d.houseNo || ''
                    const city = d.city || ''
                    const pincode = d.pincode || ''
                    const rawAddress = d.rawAddress || ''

                    const address =
                      house && city && pincode
                        ? `${house}, ${city}, ${pincode}`
                        : rawAddress

                    return (
                      <AddressCard
                        {...d}
                        rawAddress={address}
                        tag={d.saveAsTag}
                        key={i}
                        onPress={() => {
                          Alert.alert(
                            'Set Address',
                            'This will set your default address, all your meals will be delivered here.',
                            [
                              {
                                text: 'Cancel',
                                style: 'cancel'
                              },
                              {
                                text: 'YES',
                                onPress: () => {
                                  if (userId) {
                                    updateDetails({
                                      userId,
                                      address: { default: { _id: d._id } }
                                    })
                                  }
                                }
                              }
                            ]
                          )
                        }}
                        onDelete={() => {
                          Alert.alert(
                            'Delete Address',
                            'This action will delete the address, you want to delete?',
                            [
                              {
                                text: 'Cancel',
                                style: 'cancel'
                              },
                              {
                                text: 'YES',
                                onPress: () => {
                                  if (userId) {
                                    updateDetails({
                                      userId,
                                      address: { remove: [d._id] }
                                    })
                                  }
                                }
                              }
                            ]
                          )
                        }}
                        onEdit={() => {
                          navigation.navigate('EditAddress', {
                            address_id: d._id,
                            house: d.houseNo,
                            pincode: d.pincode,
                            tag: d.saveAsTag,
                            location: d.location,
                            state: d.state,
                            landmark: d.landmark,
                            city: d.city,
                            rawAddress: d.rawAddress
                          })
                        }}
                      />
                    )
                  })}
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeScreen>
  )
}
