/* eslint-disable react-native/no-inline-styles */
import { useState } from 'react';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';

import { Brand } from '@/components/molecules/Brand';
import { Button } from '@/components/reusables/ui/button';
import { Input } from '@/components/reusables/ui/input';
import { Text } from '@/components/reusables/ui/text';
import { SafeScreen } from '@/components/template';
import { useGenOtp } from '@/lib/apis/useGetOtp';
import { validatePhoneNumber } from '@/lib/functions/phone_num_valid';
import type { ApplicationScreenProps } from '@/types/navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export function LoginScreen({ navigation }: ApplicationScreenProps<'Login'>) {
  const [mobile, setMobile] = useState('');
  const { mutateAsync, isPending } = useGenOtp();

  return (
    <SafeScreen>
      <KeyboardAwareScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={20}
      >
        <View className="justify-center flex-1">
          <Brand className="mt-8" />
        </View>
        <View className="gap-2 justify-center flex-[1.5]">
          <Text className="text-4xl text-center font-bold text-slate-700 font-poppins">
            Mobile verification
          </Text>
          <Text className="text-lg text-center text-brand-light-gray font-poppins">
            Please enter your 10 digit mobile number for verification
          </Text>
          <Input
            keyboardType="phone-pad"
            placeholder="Enter 10 digit phone number"
            value={mobile}
            onChangeText={setMobile}
            size="lg"
            className="mt-8 font-poppins text-brand-text"
          />
        </View>
        <View className="flex mt-auto gap-3">
          <Button
            className="mt-auto"
            variant="link"
            size="lg"
            onPress={() => navigation.navigate('Dashboard')}
          >
            <Text className="text-blue-500 underline font-poppins font-light">
              Explore as Guest
            </Text>
          </Button>
          <Button
            className="bg-brand rounded-xl"
            size="lg"
            isLoading={isPending}
            onPress={() => {
              const error = validatePhoneNumber(mobile.trim());
              if (error) {
                Toast.show({
                  type: 'error',
                  text1: 'Error',
                  text2: error,
                });
                return;
              }

              mutateAsync({ mobile })
                .then(({ data: { _id, mobile, user }, message }) => {
                  Toast.show({
                    type: 'success',
                    text1: 'OTP Sent',
                    text2: message,
                  });
                  navigation.navigate('Otp', { _id, mobile, isSignup: !user });
                })
                .catch((err: string) => {
                  Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: err,
                  });
                });
            }}
          >
            <Text className="font-poppins">SUBMIT</Text>
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </SafeScreen>
  );
}
