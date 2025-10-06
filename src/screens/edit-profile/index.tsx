/* eslint-disable react-native/no-inline-styles */
import { useEffect, useState } from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import RNPickerSelect from 'react-native-picker-select'
import Toast from 'react-native-toast-message'
import { ArrowLeft } from 'lucide-react-native'

import { Button } from '@/components/reusables/ui/button'
import { Input } from '@/components/reusables/ui/input'
import { Text } from '@/components/reusables/ui/text'
import { SafeScreen } from '@/components/template'
import { useUpdateDetails } from '@/lib/apis/useUpdateDetails'
import { formateFullDate } from '@/lib/functions/formate_full_date'
import { useAppStore } from '@/lib/store/useAppStore'
import type { ApplicationScreenProps } from '@/types/navigation'

export function EditProfileScreen({
  navigation
}: ApplicationScreenProps<'EditProfile'>) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [gender, setGender] = useState<string>()
  const [date, setDate] = useState<Date>()

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)

  const user = useAppStore(s => s.user)
  const setUser = useAppStore(s => s.setUser)
  const userId = useAppStore(s => s.user?._id)

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setGender(user.gender)
      if (user.dob) {
        setDate(new Date(user.dob))
      }
    }
  }, [user])

  const { mutate, isPending } = useUpdateDetails({
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
        text1: 'Profile updated!',
        text2: message
      })

      if (user) {
        setUser({
          ...user,
          name: updatedUser?.name || user.name,
          email: updatedUser?.email || user.email,
          gender: updatedUser?.gender || user.gender,
          dob: updatedUser?.dob || user.dob
        })
      }

      navigation.goBack()
    }
  })

  const onSave = () => {
    if (userId) {
      mutate({ userId, email, name, gender, dob: date?.toString() })
    }
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
            Edit Profile
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
          <View className="py-2 gap-5 flex-1">
            <View className="gap-1.5">
              <Text className="text-lg text-brand-text">Full Name</Text>
              <Input
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                size="lg"
              />
            </View>
            <View className="gap-1.5">
              <Text className="text-lg text-brand-text">Email</Text>
              <Input
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email address"
                keyboardType="email-address"
                size="lg"
              />
            </View>
            <View className="gap-1.5">
              <Text className="text-lg text-brand-text">Date of Birth</Text>
              <Pressable
                onPress={() => setDatePickerVisibility(true)}
                className="bg-white flex-row items-center gap-3 px-5 py-4 rounded-xl border border-slate-200/70"
              >
                <Text className="font-poppins text-brand-text text-[15px]">
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
              <View className="flex-row items-center gap-3 rounded-xl border bg-white border-slate-200/70">
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
          </View>
        </ScrollView>
        <View className="flex mt-auto gap-3">
          <Button
            isLoading={isPending}
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
