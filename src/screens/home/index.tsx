import { ActivityIndicator, View } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import {
  Bell,
  Building2,
  Home,
  LogIn,
  MapPin,
  PlusCircle,
  ShoppingCart
} from 'lucide-react-native'

import { Button } from '@/components/reusables/ui/button'
import { Text } from '@/components/reusables/ui/text'
import { SafeScreen } from '@/components/template'
import { useUpcomingMeal } from '@/lib/apis/useUpcomingMeals'
import { useAppStore } from '@/lib/store/useAppStore'
import { useCartStore } from '@/lib/store/useCartStore'
import { cn } from '@/lib/utils'
import { ScheduleMeal } from '@/screens/home/components/schedule-meal'
import { UpcomingMeals } from '@/screens/home/components/upcoming-meal'
import type { ApplicationStackParamList } from '@/types/navigation'

// Cart Badge Component
const CartBadge = () => {
  const { getCartItemCount } = useCartStore()
  const itemCount = getCartItemCount()

  if (itemCount === 0) return null

  return (
    <View className="absolute -top-1 left-4 bg-red-500 rounded-full max-w-[36px] w-fit min-w-[18px] h-[18px] items-center justify-center">
      <Text
        className="text-white font-semibold"
        style={{ fontSize: 12, lineHeight: 19 }}
      >
        {itemCount > 99 ? '99+' : itemCount}
      </Text>
    </View>
  )
}

export function HomeTab() {
  const { navigate } =
    useNavigation<NavigationProp<ApplicationStackParamList>>()
  const accessToken = useAppStore(s => s.accessToken)

  const userId = useAppStore(s => s.user?._id)
  const { data, isLoading } = useUpcomingMeal(userId)

  const defaultAddress = useAppStore(s =>
    s.user?.address.find(a => a.isDefault)
  )

  const house = defaultAddress?.houseNo || ''
  const city = defaultAddress?.city || ''
  const rawAddress = defaultAddress?.rawAddress || ''

  const address = house && city ? `${house}, ${city}` : rawAddress
  const saveAsTag = defaultAddress?.saveAsTag?.toLowerCase()

  return (
    <SafeScreen className="pb-1">
      <View
        className={cn('flex-1 items-center gap-2', {
          'gap-4': !accessToken
        })}
      >
        <View className="flex-row justify-between gap-8 w-full">
          <Button
            className="flex-row flex-1 gap-2 !px-0"
            variant="ghost"
            onPress={() => {
              if (accessToken) {
                navigate('MyAddresses')
              } else {
                navigate('Login')
              }
            }}
          >
            {!accessToken ? (
              <>
                <LogIn color="#2B2B2B" size={22} />
                <Text className="font-poppins flex-1 text-brand-text font-medium text-lg mr-2">
                  Login
                </Text>
              </>
            ) : (
              <>
                {!address && <PlusCircle color="#2B2B2B" size={22} />}
                {saveAsTag !== 'office' &&
                  saveAsTag !== 'home' &&
                  !!address && <MapPin color="#2B2B2B" size={22} />}
                {saveAsTag === 'office' && (
                  <Building2 color="#2B2B2B" size={22} />
                )}
                {saveAsTag === 'home' && <Home color="#2B2B2B" size={22} />}
                <Text
                  numberOfLines={1}
                  className="font-poppins flex-1 text-brand-text font-medium text-lg"
                >
                  {address || 'Add Address'}
                </Text>
              </>
            )}
          </Button>
          <View className="ml-auto flex-row gap-x-2">
            <Button
              variant="ghost"
              className="!px-2 relative"
              onPress={() => navigate('Cart')}
            >
              <ShoppingCart color="#2B2B2B" size={22} />
              <CartBadge />
            </Button>
            <Button
              variant="ghost"
              className="!px-2"
              onPress={() => navigate('Alerts')}
            >
              <Bell color="#2B2B2B" size={22} />
            </Button>
          </View>
        </View>
        {isLoading ? (
          <View className="h-full justify-center items-center">
            <ActivityIndicator />
          </View>
        ) : (
          <>
            {accessToken && !!data?.data.upcomingOrders.length ? (
              <UpcomingMeals />
            ) : (
              <ScheduleMeal />
            )}
          </>
        )}
      </View>
    </SafeScreen>
  )
}
