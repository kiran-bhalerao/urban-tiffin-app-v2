import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { ArrowLeft, ChevronRight, Mail, Phone } from 'lucide-react-native'

import { Button } from '@/components/reusables/ui/button'
import { Text } from '@/components/reusables/ui/text'
import { SafeScreen } from '@/components/template'
import type { ApplicationScreenProps } from '@/types/navigation'

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1
  }
})

export function HelpScreen({ navigation }: ApplicationScreenProps<'Help'>) {
  const phoneNumber = '9637668902'
  const email = 'bk@urbantiffin.in'

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
          Contact us
        </Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
        className="flex-1"
      >
        <View className="gap-1.5 mt-4 flex-1">
          <Pressable
            onPress={() => Linking.openURL(`mailto:${email}`)}
            className="flex-row gap-2 justify-between items-center bg-white px-5 py-5 rounded-xl"
          >
            <View className="flex-row gap-3">
              <Mail color="#676767" size={21} />
              <Text className="font-poppins text-brand-dark-gray">Email</Text>
            </View>
            <ChevronRight color="#676767" size={22} />
          </Pressable>
          <Pressable
            onPress={() => Linking.openURL(`tel:${phoneNumber}`)}
            className="flex-row gap-2 justify-between items-center bg-white px-5 py-5 rounded-xl"
          >
            <View className="flex-row gap-3">
              <Phone color="#676767" size={21} />
              <Text className="font-poppins text-brand-dark-gray">Phone</Text>
            </View>
            <ChevronRight color="#676767" size={22} />
          </Pressable>
        </View>
      </ScrollView>
    </SafeScreen>
  )
}
