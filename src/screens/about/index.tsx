import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import {
  ArrowLeft,
  ChevronRight,
  CircleHelp,
  GlobeLock,
  ReceiptText,
  Truck
} from 'lucide-react-native'

import { Button } from '@/components/reusables/ui/button'
import { Text } from '@/components/reusables/ui/text'
import { SafeScreen } from '@/components/template'
import type {
  ApplicationScreenProps,
  ApplicationStackParamList
} from '@/types/navigation'

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1
  }
})

export function AboutScreen({ navigation }: ApplicationScreenProps<'About'>) {
  const { navigate } =
    useNavigation<NavigationProp<ApplicationStackParamList>>()

  return (
    <SafeScreen>
      <View className="flex-row items-center gap-3">
        <Button
          className="!px-0"
          variant="ghost"
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft color="#000" />
        </Button>
        <Text className="flex-1 text-center mr-8 text-2xl font-poppins">
          About
        </Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
        className="flex-1"
      >
        <View className="gap-1.5 mt-4 flex-1">
          <Pressable
            onPress={() => navigate('Policy')}
            className="flex-row gap-2 justify-between items-center bg-white px-5 py-5 rounded-xl"
          >
            <View className="flex-row gap-3">
              <GlobeLock color="#676767" size={21} />
              <Text className="font-poppins text-brand-dark-gray">
                Privacy Policy
              </Text>
            </View>
            <ChevronRight color="#676767" size={22} />
          </Pressable>
          <Pressable
            onPress={() => navigate('Terms')}
            className="flex-row gap-2 justify-between items-center bg-white px-5 py-5 rounded-xl"
          >
            <View className="flex-row gap-3">
              <ReceiptText color="#676767" size={21} />
              <Text className="font-poppins text-brand-dark-gray">
                Terms and Conditions
              </Text>
            </View>
            <ChevronRight color="#676767" size={22} />
          </Pressable>
          <Pressable
            onPress={() => navigate('Refund')}
            className="flex-row gap-2 justify-between items-center bg-white px-5 py-5 rounded-xl"
          >
            <View className="flex-row gap-3">
              <CircleHelp color="#676767" size={21} />
              <Text className="font-poppins text-brand-dark-gray">
                Refund Policy
              </Text>
            </View>
            <ChevronRight color="#676767" size={22} />
          </Pressable>
          <Pressable
            onPress={() => navigate('Shipment')}
            className="flex-row gap-2 justify-between items-center bg-white px-5 py-5 rounded-xl"
          >
            <View className="flex-row gap-3">
              <Truck color="#676767" size={21} />
              <Text className="font-poppins text-brand-dark-gray">
                Shipment Policy
              </Text>
            </View>
            <ChevronRight color="#676767" size={22} />
          </Pressable>
        </View>
      </ScrollView>
    </SafeScreen>
  )
}
