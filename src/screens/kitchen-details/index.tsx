import { ActivityIndicator, View } from 'react-native'
import { ArrowLeft } from 'lucide-react-native'

import { Button } from '@/components/reusables/ui/button'
import { Text } from '@/components/reusables/ui/text'
import { SafeScreen } from '@/components/template'
import { useKitchenDetails } from '@/lib/apis/useKitchenDetails'
import type { ApplicationScreenProps } from '@/types/navigation'

export function KitchenDetailsScreen({
  navigation,
  route
}: ApplicationScreenProps<'KitchenDetails'>) {
  const { name, id, kitchenManager } = route.params

  const { data, isLoading } = useKitchenDetails(id, kitchenManager)

  return (
    <SafeScreen className="px-0 py-0">
      <View className="flex-1 gap-2 px-4 py-4">
        <View className="flex-row items-center gap-3">
          <Button
            className="!px-0"
            variant="ghost"
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft color="#000" />
          </Button>
          <View className="flex-1 flex-row items-start justify-between">
            <Text
              className="flex-1 text-[20px] font-medium font-poppins"
              numberOfLines={2}
              ellipsizeMode="tail"
              lineBreakMode="tail"
            >
              {name}
            </Text>
          </View>
        </View>
        {isLoading ? (
          <View className="flex flex-1 justify-center items-center">
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <>
            <View className="flex flex-col mb-1 mt-4">
              <Text className="font-poppins text-[15px] text-brand-text">
                Kitchen Owner
              </Text>
              <Text className="font-poppins text-lg font-semibold text-brand-text">
                {data?.data.chef.name || 'NA'}
              </Text>
            </View>
            <View className="flex flex-col my-1">
              <Text className="font-poppins text-[15px] text-brand-text">
                Kitchen rating
              </Text>
              <Text className="font-poppins text-lg font-semibold text-brand-text">
                {data?.data.chef.kitchen.rating || 'NA'}
              </Text>
            </View>
            <View className="flex flex-col my-1">
              <Text className="font-poppins text-[15px] text-brand-text">
                Kitchen FSSAI
              </Text>
              <Text className="font-poppins text-lg font-semibold text-brand-text">
                {data?.data.chef.kitchen.fssaiNo || 'NA'}
              </Text>
            </View>
            <View className="flex flex-col my-1">
              <Text className="font-poppins text-[15px] text-brand-text">
                Kitchen Address
              </Text>
              <Text className="font-poppins text-lg font-semibold text-brand-text">
                {data?.data.chef.kitchen.address.rawAddress ||
                  data?.data.chef.kitchen.address.city ||
                  'NA'}
              </Text>
            </View>
          </>
        )}
      </View>
    </SafeScreen>
  )
}
