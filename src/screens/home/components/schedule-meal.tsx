import { FC, useMemo } from 'react'
import {
  Dimensions,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View
} from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { Star, Store } from 'lucide-react-native'

import Banner from '@/assets/images/banner.png'
import Dish from '@/assets/images/dish.jpeg'
import { Button } from '@/components/reusables/ui/button'
import { Text } from '@/components/reusables/ui/text'
import { SearchKitchen, useSearchKitchen } from '@/lib/apis/useSearchKitchen'
import { useGeolocation } from '@/lib/hooks/useGeolocation'
import { useRefresh } from '@/lib/hooks/useRefresh'
import { useAppStore } from '@/lib/store/useAppStore'
import { LatestAlerts } from '@/screens/home/components/latest-alerts'
import type { ApplicationStackParamList } from '@/types/navigation'
import { cn } from '@/lib/utils'

const bannerWidth = Dimensions.get('screen').width - 30
const styles = StyleSheet.create({
  image: {
    height: (bannerWidth * 598) / 760,
    width: bannerWidth
  },
  dish: { width: 75, height: 75 }
})

const MenuRow: FC<SearchKitchen> = props => {
  const {
    name,
    tags,
    images,
    rating,
    _id,
    fssai,
    kitchenManager,
    description
  } = props
  const { navigate } =
    useNavigation<NavigationProp<ApplicationStackParamList>>()

  return (
    <Pressable
      onPress={() =>
        navigate('Kitchen', { id: _id, name, kitchenManager, rating })
      }
      className="flex-row gap-6 bg-white px-4 py-3 rounded-xl items-center"
    >
      <Image
        style={styles.dish}
        defaultSource={require('@/assets/images/dish-placeholder.png')}
        source={
          images[0]
            ? {
                uri: images[0]
              }
            : Dish
        }
        className="rounded-full"
      />
      <View className="flex-1">
        <Text
          className="font-poppins font-medium text-lg"
          numberOfLines={2}
          ellipsizeMode="tail"
          lineBreakMode="tail"
        >
          {name}
        </Text>
        <View className="flex-row items-center gap-1.5">
          <Star size={14} fill="#FFA922" strokeWidth={0} />
          <Text className="font-poppins">{rating}</Text>
        </View>
        <View className="flex-row, flex-1">
          <Text
            className="font-poppins mt-0.5 text-slate-600 flex-1 flex-wrap"
            numberOfLines={2}
            ellipsizeMode="tail"
            lineBreakMode="tail"
          >
            {description || tags.slice(0, 4).join(', ')}
          </Text>
        </View>
      </View>
    </Pressable>
  )
}

export const ScheduleMeal = () => {
  const { navigate } =
    useNavigation<NavigationProp<ApplicationStackParamList>>()

  const GeoLocation = useGeolocation()
  const UserLocation = useAppStore(s => {
    const loc = s.user?.address?.find(a => a.isDefault)?.location
    if (!loc) return undefined

    return {
      lat: loc.coordinates[0],
      lng: loc.coordinates[1]
    }
  })

  const { data } = useSearchKitchen(
    {
      text: '',
      location: UserLocation || GeoLocation
    },
    5
  )
  const { refreshing, onRefresh } = useRefresh()
  const kitchens = useMemo(
    () => data?.pages.map(page => page.data.kitchens).flat() || [],
    [data?.pages]
  )

  return (
    <ScrollView
      contentContainerClassName={cn({
        'flex-1': kitchens.length === 0
      })}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 items-center gap-4">
        <Image style={styles.image} resizeMode="contain" source={Banner} />
        <View className="flex-1 gap-4 w-full">
          {/* <Button
            className="bg-brand rounded-xl"
            size="lg"
            onPress={() => navigate('Search')}
          >
            <Text className="font-poppins text-white font-medium">
              Schedule my first meals
            </Text>
          </Button> */}
          <LatestAlerts />
          <Text className="font-poppins font-medium text-brand-text text-lg">
            Top rated kitchens in your city
          </Text>
          <View className="gap-2 flex-1">
            {kitchens.length > 0 ? (
              kitchens?.map(k => {
                return <MenuRow key={k._id} {...k} />
              })
            ) : (
              <View className="flex-1 gap-3 items-center justify-center">
                <Store size={50} color="#d1d5db" />
                <Text className="text-center">
                  No kitchens found in your location,{'\n'}try changing your
                  location
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
