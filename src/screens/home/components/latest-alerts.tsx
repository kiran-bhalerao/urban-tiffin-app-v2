import { useMemo } from 'react'
import { Text, View } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { MoveRight } from 'lucide-react-native'

import { Button } from '@/components/reusables/ui/button'
import { useAlerts } from '@/lib/apis/useAlerts'
import { storage } from '@/lib/MMKV'
import { useAppStore } from '@/lib/store/useAppStore'
import { ApplicationStackParamList } from '@/types/navigation'

export const LatestAlerts = () => {
  const { navigate } =
    useNavigation<NavigationProp<ApplicationStackParamList>>()

  const isLoggedIn = useAppStore(s => !!s.accessToken)
  const userId = useAppStore(s => s.user?._id)

  const { data } = useAlerts(userId)
  const latestAlert = data?.pages?.[0].data.alerts?.[0]

  const storedAlertId = useMemo(() => {
    return storage.getString('LAST_ALERT_ID')
  }, [])

  if (!isLoggedIn || !latestAlert || storedAlertId === latestAlert._id)
    return null

  return (
    <View className="gap-1 w-full">
      <View className="flex-row justify-between">
        <Text className="font-poppins font-medium text-brand-text text-lg">
          Latest alerts
        </Text>
        <Button
          onPress={() => navigate('Alerts')}
          size="sm"
          variant="ghost"
          className="flex-row items-center !h-8 "
        >
          <Text className="text-brand-text uppercase text-sm">More</Text>
          <View className="justify-center">
            <MoveRight color="#2B2B2B" size={16} />
          </View>
        </Button>
      </View>
      <View className="px-3 py-3 border border-slate-200/70 bg-white rounded-xl">
        <Text className="font-poppins text-brand-text">
          {latestAlert.description}
        </Text>
      </View>
    </View>
  )
}
