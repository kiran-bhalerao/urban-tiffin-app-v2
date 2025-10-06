import { useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

export const useRefresh = () => {
  const [refreshing, setRefreshing] = useState(false)
  const queryClient = useQueryClient()

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    void queryClient.refetchQueries()
    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }, [queryClient])

  return {
    refreshing,
    onRefresh
  }
}
