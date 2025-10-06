/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { ArrowLeft, Building2, Home, MapPin } from 'lucide-react-native'
import * as yup from 'yup'

import { Button } from '@/components/reusables/ui/button'
import { Input } from '@/components/reusables/ui/input'
import { Text } from '@/components/reusables/ui/text'
import { SafeScreen } from '@/components/template'
import { useCreateProfile } from '@/lib/apis/useCreateProfile'
import { useGeoCordByPlace } from '@/lib/apis/useGeoCordByPlace'
import { useUpdateDetails } from '@/lib/apis/useUpdateDetails'
import { useAppStore } from '@/lib/store/useAppStore'
import { cn } from '@/lib/utils'
import type { ApplicationScreenProps } from '@/types/navigation'

const addressSchema = yup.object({
  house: yup.string().required('Please enter your house no / building name'),
  landmark: yup
    .string()
    .required('Please enter your road name / area / landmark'),
  city: yup.string().required('Please enter your city'),
  state: yup.string().required('Please enter your state'),
  pincode: yup
    .string()
    .matches(/^[1-9][0-9]{5}$/, 'Invalid pincode')
    .required('Please enter your pincode')
})

export function EditAddressScreen({
  navigation,
  route
}: ApplicationScreenProps<'EditAddress'>) {
  const {
    state,
    place_id,
    location,
    pincode,
    address_id,
    house,
    landmark,
    city,
    profile_data,
    tag,
    rawAddress,
    type = 'save_address'
  } = route.params

  const { mutate: getGeoCord, data } = useGeoCordByPlace()

  useEffect(() => {
    if (place_id) {
      getGeoCord({ placeId: place_id })
    }
  }, [getGeoCord, place_id])

  const [_house, setHouse] = useState(house || '')
  const [_state, setState] = useState(state)
  const [_landmark, setLandmark] = useState(landmark)
  const [_city, setCity] = useState(city)
  const [_pincode, setPinCode] = useState<string>(pincode || '')
  const [_tag, setTag] = useState(tag?.toLowerCase() || 'home')

  const [errors, setErrors] = useState<Record<string, string>>({})
  const validateProfile = (
    address: yup.InferType<typeof addressSchema>,
    cb?: () => void
  ) => {
    addressSchema
      .validate(address, { abortEarly: false })
      .then(() => {
        setErrors({})
        cb?.()
      })
      .catch((err: { inner: { path: string; errors: string[] }[] }) => {
        const errors = err.inner.reduce(
          (acc, e) => ({ ...acc, [e.path]: e.errors[0] }),
          {}
        )

        setErrors(errors)
      })
  }

  const onBlur = () => {
    validateProfile({
      house: _house,
      city: _city,
      state: _state,
      pincode: _pincode,
      landmark: _landmark
    })
  }

  const user = useAppStore(s => s.user)
  const setUser = useAppStore(s => s.setUser)
  const userId = useAppStore(s => s.user?._id)
  const setAccessToken = useAppStore(s => s.setAccessToken)

  const { mutate: createProfile, isPending } = useCreateProfile({
    onError(error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error
      })
    },
    onSuccess({ message, data: { token, user } }) {
      // save accessToken
      Toast.show({
        type: 'success',
        text1: 'Login Success',
        text2: message
      })

      setUser(user)
      setAccessToken(token)
      navigation.navigate('Dashboard')
    }
  })

  const { mutate: updateDetails, isPending: updateDetailsPending } =
    useUpdateDetails({
      onError(error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error
        })
      },
      onSuccess({ message, data: { updatedUser } }) {
        Toast.show({
          type: 'success',
          text1: 'Address Saved',
          text2: message
        })

        if (user) {
          setUser({ ...user, address: updatedUser?.addresses || user.address })
        }

        navigation.goBack()
      }
    })

  const onSave = () => {
    validateProfile(
      {
        house: _house,
        city: _city,
        state: _state,
        pincode: _pincode,
        landmark: _landmark
      },
      () => {
        if (type === 'create_profile') {
          if (profile_data && data?.data) {
            const { _id, mobile, otp, fullName, email, gender, dob } =
              profile_data

            createProfile({
              _id,
              mobile,
              otp,
              name: fullName,
              gender,
              dob,
              email,
              address: {
                location: {
                  type: 'Point',
                  coordinates: [data.data.location.lat, data.data.location.lng]
                },
                rawAddress,
                houseNo: _house,
                city: _city,
                state: _state,
                pincode: _pincode,
                landmark: _landmark
              }
            })
          }
        } else if (userId && address_id) {
          updateDetails({
            userId,
            address: {
              update: {
                _id: address_id,
                location,
                rawAddress,
                houseNo: _house,
                city: _city,
                state: _state,
                pincode: _pincode,
                landmark: _landmark,
                saveAsTag: _tag
              }
            }
          })
        } else if (userId && (data?.data || location)) {
          updateDetails({
            userId,
            address: {
              add: {
                location: location || {
                  type: 'Point',
                  coordinates: [
                    data!.data.location.lat,
                    data!.data.location.lng
                  ]
                },
                rawAddress,
                houseNo: _house,
                city: _city,
                state: _state,
                pincode: _pincode,
                landmark: _landmark,
                saveAsTag: _tag
              }
            }
          })
        }
      }
    )
  }

  return (
    <SafeScreen>
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
            {type === 'create_profile' ? 'Create Address' : 'Save Address'}{' '}
          </Text>
        </View>
        <ScrollView
          automaticallyAdjustKeyboardInsets
          showsVerticalScrollIndicator={false}
        >
          <View className="py-2 gap-4">
            <View className="gap-1.5">
              <Text className="text-lg text-brand-text">
                House no. / Building name
              </Text>
              <Input
                value={_house}
                onChangeText={setHouse}
                placeholder="Enter your house no. / building name"
                size="lg"
                onBlur={onBlur}
              />
              {errors.house && (
                <Text className="text-sm text-brand-red ml-2">
                  {errors.house}
                </Text>
              )}
            </View>
            <View className="gap-1.5">
              <Text className="text-lg text-brand-text">
                Road name / Area / Landmark
              </Text>
              <Input
                value={_landmark}
                onChangeText={setLandmark}
                placeholder="Enter your road name / area name / landmark"
                size="lg"
                onBlur={onBlur}
              />
              {errors.landmark && (
                <Text className="text-sm text-brand-red ml-2">
                  {errors.landmark}
                </Text>
              )}
            </View>
            <View className="gap-1.5">
              <Text className="text-lg text-brand-text">City</Text>
              <Input
                value={_city}
                onChangeText={setCity}
                placeholder="Enter your city"
                size="lg"
                onBlur={onBlur}
              />
              {errors.city && (
                <Text className="text-sm text-brand-red ml-2">
                  {errors.city}
                </Text>
              )}
            </View>
            <View className="gap-1.5">
              <Text className="text-lg text-brand-text">State</Text>
              <Input
                value={_state}
                onChangeText={setState}
                placeholder="Enter your state"
                size="lg"
                onBlur={onBlur}
              />
              {errors.state && (
                <Text className="text-sm text-brand-red ml-2">
                  {errors.state}
                </Text>
              )}
            </View>
            <View className="gap-1.5">
              <Text className="text-lg text-brand-text">Pin code</Text>
              <Input
                value={_pincode}
                onChangeText={setPinCode}
                placeholder="Enter your pin code"
                size="lg"
                keyboardType="number-pad"
                onBlur={onBlur}
              />
              {errors.pincode && (
                <Text className="text-sm text-brand-red ml-2">
                  {errors.pincode}
                </Text>
              )}
            </View>
            <View className="gap-1.5">
              <Text className="text-lg text-brand-text">Save address as</Text>
              <View className="flex-row gap-1">
                <Button
                  onPress={() => setTag('home')}
                  size="sm"
                  className={cn(
                    'flex-1 bg-transparent border border-input rounded-lg',
                    {
                      'border-brand': _tag === 'home'
                    }
                  )}
                >
                  <View className="flex-1 flex-row items-center justify-center gap-1.5">
                    <Home
                      size={18}
                      color={_tag === 'home' ? '#FFA922' : '#2B2B2B'}
                    />
                    <Text
                      className={cn('text-brand-text', {
                        'text-brand': _tag === 'home'
                      })}
                    >
                      Home
                    </Text>
                  </View>
                </Button>
                <Button
                  onPress={() => setTag('office')}
                  size="sm"
                  className={cn(
                    'flex-1 bg-transparent border border-input rounded-lg',
                    {
                      'border-brand': _tag === 'office'
                    }
                  )}
                >
                  <View className="flex-1 flex-row items-center justify-center gap-1.5">
                    <Building2
                      size={18}
                      color={_tag === 'office' ? '#FFA922' : '#2B2B2B'}
                    />
                    <Text
                      className={cn('text-brand-text', {
                        'text-brand': _tag === 'office'
                      })}
                    >
                      Office
                    </Text>
                  </View>
                </Button>
                <Button
                  onPress={() => setTag('other')}
                  size="sm"
                  className={cn(
                    'flex-1 bg-transparent border border-input rounded-lg',
                    {
                      'border-brand': _tag === 'other'
                    }
                  )}
                >
                  <View className="flex-1 flex-row items-center justify-center gap-1.5">
                    <MapPin
                      size={18}
                      color={_tag === 'other' ? '#FFA922' : '#2B2B2B'}
                    />
                    <Text
                      className={cn('text-brand-text', {
                        'text-brand': _tag === 'other'
                      })}
                    >
                      Other
                    </Text>
                  </View>
                </Button>
              </View>
            </View>
          </View>
        </ScrollView>
        <View className="flex mt-auto gap-3">
          <Button
            isLoading={isPending || updateDetailsPending}
            onPress={onSave}
            className="bg-brand rounded-xl"
            size="lg"
          >
            <Text className="font-poppins">Save</Text>
          </Button>
        </View>
      </View>
    </SafeScreen>
  )
}
