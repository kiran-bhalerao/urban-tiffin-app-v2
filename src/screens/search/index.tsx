import React, { FC, useMemo, useRef, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  View
} from 'react-native'
import {
  NavigationProp,
  useFocusEffect,
  useNavigation
} from '@react-navigation/native'
import { ArrowLeft, Search, Star } from 'lucide-react-native'
import { useDebounceValue } from 'usehooks-ts'

import { Button } from '@/components/reusables/ui/button'
import { Input } from '@/components/reusables/ui/input'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/reusables/ui/tabs'
import { Text } from '@/components/reusables/ui/text'
import { SafeScreen } from '@/components/template'
import { SearchDish, useSearchDish } from '@/lib/apis/useSearchDish'
import { SearchKitchen, useSearchKitchen } from '@/lib/apis/useSearchKitchen'
import { useGeolocation } from '@/lib/hooks/useGeolocation'
import { useAppStore } from '@/lib/store/useAppStore'
import { cn } from '@/lib/utils'
import type {
  ApplicationScreenProps,
  ApplicationStackParamList
} from '@/types/navigation'

const styles = StyleSheet.create({
  dish: { width: 65, height: 65 }
  // gap: { gap: 10, paddingBottom: 4 }
})

const KitchenRow: FC<SearchKitchen & { scheduleDate?: string }> = props => {
  const {
    name,
    tags,
    images,
    rating,
    _id,
    description,
    kitchenManager,
    scheduleDate
  } = props
  const { navigate } =
    useNavigation<NavigationProp<ApplicationStackParamList>>()

  return (
    <Pressable
      onPress={() =>
        navigate('Kitchen', {
          id: _id,
          name,
          rating,
          kitchenManager,
          scheduleDate
        })
      }
      className="flex-row gap-6 bg-white px-4 py-3.5 border-b border-gray-200 rounded-xl items-center"
    >
      <Image
        style={styles.dish}
        defaultSource={require('@/assets/images/dish-placeholder.png')}
        source={
          images[0]
            ? { uri: images[0] }
            : require('@/assets/images/dish-placeholder.png')
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

const DishRow: FC<SearchDish & { scheduleDate?: string }> = props => {
  const {
    name,
    mealItems,
    price,
    mealPreference,
    kitchen: _kitchen,
    scheduleDate,
    kitchenManager
  } = props
  const { navigate } =
    useNavigation<NavigationProp<ApplicationStackParamList>>()

  const kitchen = _kitchen[0]

  return (
    <Pressable
      onPress={() =>
        navigate('Kitchen', {
          id: kitchen._id,
          name: kitchen.name,
          rating: kitchen.rating,
          kitchenManager,
          scheduleDate
        })
      }
      className="flex-row gap-6 bg-white px-4 py-3.5 border-b border-gray-200 rounded-xl items-center"
    >
      <View className="flex-1">
        <View className="flex-row gap-2 items-center">
          <View
            className={cn('p-1 border border-red-600', {
              'border-green-600': mealPreference.toLowerCase() === 'veg'
            })}
          >
            <View
              className={cn('h-2 w-2 bg-red-600 rounded-full', {
                'bg-green-600': mealPreference.toLowerCase() === 'veg'
              })}
            />
          </View>
          <Text
            className="font-poppins font-medium text-lg"
            numberOfLines={2}
            ellipsizeMode="tail"
            lineBreakMode="tail"
          >
            {name}
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Text
            className="font-poppins"
            numberOfLines={3}
            ellipsizeMode="tail"
            lineBreakMode="tail"
          >
            {kitchen.name}
          </Text>
        </View>
        <View className="flex-row">
          <Text
            className="font-poppins mt-0.5 text-slate-600 flex-1 flex-wrap"
            numberOfLines={2}
            ellipsizeMode="tail"
            lineBreakMode="tail"
          >
            ₹ {price.toLocaleString()} | {mealItems.map(m => m.name).join(', ')}
          </Text>
        </View>
      </View>
    </Pressable>
  )
}

export function SearchScreen({
  navigation,
  route
}: ApplicationScreenProps<'Search'>) {
  const [value, setValue] = useState('kitchen')

  const [mealPreference, setMealPreference] = React.useState('veg')
  function onLabelPress(label: string) {
    return () => {
      setMealPreference(label)
    }
  }

  const GeoLocation = useGeolocation()
  const UserLocation = useAppStore(s => {
    const loc = s.user?.address?.find(a => a.isDefault)?.location
    if (!loc) return undefined

    return {
      lat: loc.coordinates[0],
      lng: loc.coordinates[1]
    }
  })

  const [debouncedValue, setKeyword] = useDebounceValue('', 500)
  const {
    data,
    isFetching: kitchenFetching,
    fetchNextPage
  } = useSearchKitchen({
    text: debouncedValue,
    mealPreference,
    location: UserLocation || GeoLocation
  })

  const {
    data: dishData,
    isFetching: dishLoading,
    fetchNextPage: fetchNextPageDish
  } = useSearchDish({
    text: debouncedValue,
    mealPreference,
    location: UserLocation || GeoLocation
  })

  const kitchens = useMemo(
    () => data?.pages.map(page => page.data.kitchens).flat() || [],
    [data?.pages]
  )

  const dishes = useMemo(
    () => dishData?.pages.map(page => page.data.meals).flat() || [],
    [dishData?.pages]
  )

  const KitchenListLoader = useMemo(() => {
    if (kitchenFetching) {
      return (
        <View className="py-8">
          <ActivityIndicator size="large" />
        </View>
      )
    }

    return null
  }, [kitchenFetching])

  const DishListLoader = useMemo(() => {
    if (dishLoading) {
      return (
        <View className="py-8">
          <ActivityIndicator size="large" />
        </View>
      )
    }

    return null
  }, [dishLoading])

  const ref = useRef<TextInput>(null)
  useFocusEffect(() => ref.current?.focus())

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
          <View className="bg-white rounded-xl flex-1 flex-row items-center pl-4 border border-brand-light-gray/30">
            <Search size={20} color="#FFA922" />
            <Input
              ref={ref}
              size="lg"
              onChangeText={setKeyword}
              placeholder="Search for meals/ kitchens"
              className="font-poppins border-0 flex-1"
            />
          </View>
        </View>

        <Tabs
          value={value}
          onValueChange={setValue}
          className="w-full mx-auto flex-1 flex-col gap-1.5 bg-white rounded-xl mt-2"
        >
          <TabsList className="flex-row w-full">
            <TabsTrigger value="kitchen" className="flex-1">
              <Text className="font-poppins">Kitchen</Text>
            </TabsTrigger>
            <TabsTrigger value="dish" className="flex-1">
              <Text className="font-poppins">Meals</Text>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="kitchen" className="flex-1">
            <FlatList
              data={kitchens}
              renderItem={({ item }) => (
                <KitchenRow
                  key={item._id}
                  {...item}
                  scheduleDate={route.params?.scheduleDate}
                />
              )}
              keyExtractor={(_, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerClassName={cn({
                'justify-center grow': !kitchens.length
              })}
              onEndReached={() => fetchNextPage()}
              onEndReachedThreshold={0.001}
              ListFooterComponent={KitchenListLoader}
            />
          </TabsContent>
          <TabsContent value="dish" className="flex-1">
            <FlatList
              data={dishes}
              renderItem={({ item }) => (
                <DishRow
                  key={item._id}
                  {...item}
                  scheduleDate={route.params?.scheduleDate}
                />
              )}
              keyExtractor={(_, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerClassName={cn({
                'justify-center grow': !dishes.length
              })}
              onEndReached={() => fetchNextPageDish()}
              onEndReachedThreshold={0.001}
              ListFooterComponent={DishListLoader}
            />
          </TabsContent>
        </Tabs>
      </View>
    </SafeScreen>
  )
}
