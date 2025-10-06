/* eslint-disable react-native/no-inline-styles */
import { useState } from 'react'
import { Linking, Pressable, ScrollView, View } from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import RNPickerSelect from 'react-native-picker-select'
import { ArrowLeft } from 'lucide-react-native'
import * as yup from 'yup'

import { Button } from '@/components/reusables/ui/button'
import { Input } from '@/components/reusables/ui/input'
import { Text } from '@/components/reusables/ui/text'
import { SafeScreen } from '@/components/template'
import { formateFullDate } from '@/lib/functions/formate_full_date'
import type { ApplicationScreenProps } from '@/types/navigation'

const profileSchema = yup.object({
  fullName: yup.string().required('Please enter your full name'),
  email: yup
    .string()
    .required('Please enter your email address')
    .email('Please enter valid email address')
})

export function CreateProfileScreen({
  navigation,
  route
}: ApplicationScreenProps<'CreateProfile'>) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [gender, setGender] = useState<string>()
  const [date, setDate] = useState<Date>()

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)

  const [errors, setErrors] = useState<Record<string, string>>({})

  const { _id, mobile, otp } = route.params

  const validateProfile = (
    profile: yup.InferType<typeof profileSchema>,
    cb?: () => void
  ) => {
    profileSchema
      .validate(profile, { abortEarly: false })
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

  const onNextPress = () => {
    validateProfile({ email, fullName }, () => {
      navigation.navigate('YourLocation', {
        email,
        fullName,
        gender,
        dob: date?.toString(),
        _id,
        mobile,
        otp
      })
    })
  }

  const onBlur = () => {
    validateProfile({ email, fullName })
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
            Create Profile
          </Text>
        </View>
        <ScrollView
          automaticallyAdjustKeyboardInsets
          showsVerticalScrollIndicator={false}
          style={{
            alignSelf: 'stretch',
            height: 'auto',
            flex: 1,
            flexGrow: 1
          }}
        >
          <View className="py-2 gap-4">
            <View className="gap-1.5">
              <Text className="text-lg text-brand-text">First Name</Text>
              <Input
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your first name"
                size="lg"
                onBlur={onBlur}
              />
              {errors.fullName && (
                <Text className="text-sm text-brand-red ml-2">
                  {errors.firstName}
                </Text>
              )}
            </View>

            <View className="gap-1.5">
              <Text className="text-lg text-brand-text">Email</Text>
              <Input
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email address"
                keyboardType="email-address"
                size="lg"
                onBlur={onBlur}
              />
              {!!errors.email && (
                <Text className="text-sm text-brand-red ml-2">
                  {errors.email}
                </Text>
              )}
            </View>
            <View className="gap-1.5">
              <Text className="text-lg text-brand-text">Date of Birth</Text>
              <Pressable
                onPress={() => setDatePickerVisibility(true)}
                className="bg-white flex-row items-center gap-3 px-5 py-4 rounded-xl border border-slate-200/70"
              >
                <Text className="font-poppins text-brand-text text-lg">
                  {date ? formateFullDate(date.toString()) : 'Choose a date'}
                </Text>
              </Pressable>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                maximumDate={new Date()}
                minimumDate={new Date(1950, 0, 1)}
                onConfirm={date => {
                  setDate(date)
                  setDatePickerVisibility(false)
                }}
                onCancel={() => setDatePickerVisibility(false)}
              />
            </View>
            <View className="gap-1.5">
              <Text className="text-lg text-brand-text">Gender</Text>
              <View className="flex-row items-center gap-3 rounded-xl bg-white overflow-hidden border border-slate-200/70">
                <RNPickerSelect
                  value={gender}
                  placeholder={{ label: 'Select your gender' }}
                  style={{
                    placeholder: { fontSize: 16, color: '#000' },
                    inputAndroid: {
                      fontSize: 16,
                      color: '#000',
                      paddingVertical: 15,
                      paddingHorizontal: 16,
                      borderRadius: 10,
                      minWidth: '100%',
                      backgroundColor: 'transparent'
                    },
                    inputIOS: {
                      fontSize: 16,
                      color: '#000',
                      paddingVertical: 15,
                      paddingHorizontal: 16,
                      borderRadius: 10,
                      minWidth: '100%',
                      backgroundColor: '#fff'
                    }
                  }}
                  onValueChange={setGender}
                  items={[
                    { label: 'Male', value: 'male' },
                    { label: 'Female', value: 'female' },
                    { label: 'other', value: 'other' }
                  ]}
                />
              </View>
            </View>
            <View className="gap-1.5">
              <Text className="text-lg text-brand-text">Select City</Text>
              <Text className="font-poppins text-sm">
                Note: we are currently available only in the cities below
              </Text>
              <View>
                <Pressable className="bg-white rounded-xl px-4 items-center py-3 border border-brand">
                  <Text className="text-lg text-brand-text font-poppins font-semibold">
                    Pune
                  </Text>
                </Pressable>
              </View>
              <Button
                variant="link"
                size="lg"
                onPress={() => {
                  Linking.openURL('https://urbantiffin.in/').catch(() => {})
                }}
              >
                <Text className="text-blue-500 underline font-light font-poppins">
                  Request your city
                </Text>
              </Button>
            </View>
          </View>
        </ScrollView>
        <View className="flex mt-auto gap-3">
          <Button
            onPress={onNextPress}
            className="bg-brand rounded-xl"
            size="lg"
          >
            <Text className="font-poppins">Next</Text>
          </Button>
        </View>
      </View>
    </SafeScreen>
  )
}
