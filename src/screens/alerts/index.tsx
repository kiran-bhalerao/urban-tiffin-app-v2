import { useCallback, useEffect, useMemo } from 'react'
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  StyleSheet,
  View
} from 'react-native'
import { ArrowLeft } from 'lucide-react-native'

import { Button } from '@/components/reusables/ui/button'
import { Text } from '@/components/reusables/ui/text'
import { SafeScreen } from '@/components/template'
import { Alerts, useAlerts } from '@/lib/apis/useAlerts'
import { storage } from '@/lib/MMKV'
import { useAppStore } from '@/lib/store/useAppStore'
import type { ApplicationScreenProps } from '@/types/navigation'

const styles = StyleSheet.create({
  gap: { gap: 5 }
})

export function AlertsScreen({ navigation }: ApplicationScreenProps<'Alerts'>) {
  const userId = useAppStore(s => s.user?._id)
  const { data, fetchNextPage, isFetching } = useAlerts(userId)

  const alerts = useMemo(
    () => data?.pages.map(page => page.data.alerts).flat() || [],
    [data?.pages]
  )

  const latestAlertId = alerts?.[0]?._id

  useEffect(() => {
    if (latestAlertId) {
      storage.set('LAST_ALERT_ID', latestAlertId)
    }
  }, [latestAlertId])

  const renderItem: ListRenderItem<Alerts> = useCallback(
    ({ item }) => (
      <View className="bg-white border border-slate-200/70 px-4 py-5 rounded-xl">
        <Text className="font-poppins font-semibold mb-2">
          {new Date(item.date).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}
        </Text>
        <Text className="font-poppins">{item.description}</Text>
      </View>
    ),
    []
  )

  const ListLoader = useMemo(() => {
    if (isFetching) {
      return (
        <View className="py-6">
          <ActivityIndicator size="large" />
        </View>
      )
    }

    return null
  }, [isFetching])

  return (
    <SafeScreen className="pb-0">
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
            Alerts
          </Text>
        </View>
        <FlatList
          data={alerts}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.gap}
          showsVerticalScrollIndicator={false}
          onEndReached={() => fetchNextPage()}
          onEndReachedThreshold={0.001}
          ListFooterComponent={userId ? ListLoader : undefined}
        />
      </View>
    </SafeScreen>
  )
}
