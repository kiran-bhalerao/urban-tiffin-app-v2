import { Fragment } from 'react'
import {
  Dimensions,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { Search } from 'lucide-react-native'

import { useUpcomingMeal } from '@/lib/apis/useUpcomingMeals'
import { formateFullDate } from '@/lib/functions/formate_full_date'
import { useRefresh } from '@/lib/hooks/useRefresh'
import { useAppStore } from '@/lib/store/useAppStore'
import { cn } from '@/lib/utils'
import { LatestAlerts } from '@/screens/home/components/latest-alerts'
import { ApplicationStackParamList } from '@/types/navigation'

// const bannerWidth = ((Dimensions.get('screen').width - 30) * 70) / 100
// const bannerHeight = (bannerWidth * 598) / 760

const bannerSize = ((Dimensions.get('screen').width - 30) * 50) / 100

const styles = StyleSheet.create({
  image: {
    height: bannerSize,
    width: bannerSize,
    borderRadius: 300
  },
  gradient: {
    flex: 1,
    alignSelf: 'stretch',
    borderRadius: 24,
    padding: 20,
    paddingBottom: 14
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dish: { width: 50, height: 50 },
  stretch: {
    alignSelf: 'stretch',
    height: 'auto',
    flex: 1,
    flexGrow: 1
  },
  scrollView: {
    flexGrow: 1
  }
})

export const UpcomingMeals = () => {
  const { navigate } =
    useNavigation<NavigationProp<ApplicationStackParamList>>()

  const userId = useAppStore(s => s.user?._id)
  const { data } = useUpcomingMeal(userId)
  const upcomingMeal = data?.data.upcomingOrders[0]
  const upcomingImage =
    upcomingMeal?.meals[0]?.image ||
    'https://urban-tiffin.s3.ap-south-1.amazonaws.com/kitchen1.png'

  const { refreshing, onRefresh } = useRefresh()

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
      style={styles.stretch}
    >
      {/* <Pressable
        onPress={() => navigate('Search')}
        className="bg-white flex-row items-center gap-3 px-5 py-4 mb-4 rounded-xl border border-slate-200/70"
      >
        <Search color="#FFA922" size={20} />
        <Text className="font-poppins text-brand-text text-lg">
          Search meal or kitchen
        </Text>
      </Pressable> */}
      <View className="flex-1 items-center gap-4 relative">
        <LinearGradient
          colors={['#FFBC39', '#FF9408', '#FF6B00']}
          start={{ x: 0.6, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.gradient}
        >
          <Text className="font-poppins text-brand-text text-sm">
            Upcoming meal
          </Text>
          <View className="h-[1] w-12 mt-1 bg-[#A83200]" />
          <View className="mt-4 gap-6">
            <Text
              className="font-poppins text-2xl text-brand-text font-semibold flex-[5]"
              numberOfLines={3}
            >
              {upcomingMeal?.meals?.[0]?.name || 'Not Available'}
            </Text>
            <View className="flex-[3]">
              <Text className="font-poppins text-white/90">
                {formateFullDate(upcomingMeal?.deliveryDate)}
              </Text>
              <Text
                className="font-poppins text-white/90 mt-1 leading-[16px]"
                numberOfLines={2}
              >
                {upcomingMeal?.kitchen.name || 'Not Available'}
              </Text>
            </View>
          </View>
        </LinearGradient>
        <LatestAlerts />
        <View className="flex-1 gap-4 w-full">
          <View className="gap-2 flex-1">
            <Text className="font-poppins font-medium text-brand-text text-lg">
              Your meals this week
            </Text>
            {data?.data.upcomingOrders?.map?.((order, i) => {
              return (
                <Fragment key={order.deliveryDate}>
                  <View
                    className={cn('gap-2', {
                      'mt-2': i > 0
                    })}
                  >
                    <Text className="text-brand font-poppins uppercase font-semibold">
                      {order.title}
                    </Text>
                  </View>
                  <View className="gap-y-2 flex-1">
                    {order.meals.map(
                      (
                        {
                          quantity,
                          name,
                          mealTime,
                          deliveryStatus,
                          mealPreference = 'VEG',
                          image: images
                        },
                        j
                      ) => {
                        return (
                          <View
                            key={j}
                            className="gap-x-3 bg-white rounded-xl flex-row-reverse px-3 py-4 items-center flex-1"
                          >
                            <View className="gap-x-3 flex-row items-center flex-1">
                              <View className="items-center gap-y-1.5">
                                <Image
                                  style={styles.dish}
                                  defaultSource={require('@/assets/images/dish-placeholder.png')}
                                  source={
                                    images ||
                                    require('@/assets/images/dish-placeholder.png')
                                  }
                                  className="rounded-full mx-auto"
                                />
                                <View className="bg-brand/15 px-1.5 py-[2.5px] rounded">
                                  <Text className="text-brand font-poppins capitalize text-xs font-semibold">
                                    {mealTime}
                                  </Text>
                                </View>
                              </View>
                              <View className="grow flex-1">
                                <View className="flex-row justify-between gap-x-4">
                                  <Text
                                    className="font-poppins text-brand-dark-gray text-[15px] pb-1 flex-1 font-medium"
                                    numberOfLines={2}
                                  >
                                    {quantity || 1} x {name}
                                  </Text>
                                  <View className="flex-row items-start justify-between">
                                    <View
                                      className={cn(
                                        'p-1 border border-red-600 mt-1 flex justify-center items-center mr-2',
                                        {
                                          'border-green-600':
                                            mealPreference.toLowerCase() ===
                                            'veg'
                                        }
                                      )}
                                    >
                                      <View
                                        className={cn(
                                          'h-1.5 w-1.5 bg-red-600 rounded-full',
                                          {
                                            'bg-green-600':
                                              mealPreference.toLowerCase() ===
                                              'veg'
                                          }
                                        )}
                                      />
                                    </View>
                                    {/* <View className="bg-brand/15 px-1.5 py-[2.5px] rounded">
                                      <Text className="text-brand font-poppins capitalize text-xs font-semibold">
                                        {mealTime}
                                      </Text>
                                    </View> */}
                                  </View>
                                </View>
                                <View className="flex-row gap-x-5 flex-wrap items-start">
                                  <Text className="text-brand-dark-gray flex-1 text-[13px]">
                                    {order.kitchen.name}
                                  </Text>
                                  <View className="bg-brand-violet/10 rounded-lg px-2 py-1">
                                    <Text className="font-poppins font-medium text-center text-xs text-brand-violet capitalize">
                                      {deliveryStatus || 'NA'}
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            </View>
                          </View>
                        )
                      }
                    )}
                  </View>
                </Fragment>
              )
            })}
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
