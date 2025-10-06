import { useContext, useMemo } from 'react'
import { MealBookingConfigManagerContext } from '@/providers/data-load'

interface UseMealBookingManagerProps {
  activeDay: string | undefined
  tab: 'lunch' | 'dinner'
}

export const useMealBookingManager = ({
  activeDay,
  tab
}: UseMealBookingManagerProps) => {
  const { configManager } = useContext(MealBookingConfigManagerContext)

  const mealRestrictionStatus = useMemo(() => {
    return configManager.getMealRestrictionStatus(activeDay, tab)
  }, [configManager, activeDay, tab])

  const restrictionMessage = useMemo(() => {
    return configManager.getRestrictionMessage(mealRestrictionStatus)
  }, [configManager, mealRestrictionStatus])

  const getBookingStatusForDate = (
    date: string,
    mealType: 'lunch' | 'dinner'
  ) => {
    const targetDate = new Date(date)
    return configManager.getMealBookingStatus(mealType, targetDate)
  }

  const isTomorrow = (currentDay: string | undefined) => {
    if (!currentDay) return false
    const targetDate = new Date(currentDay)
    const today = new Date()
    return targetDate.getDate() === today.getDate() + 1
  }

  return {
    isTomorrow: isTomorrow(activeDay),
    isBookingDisabled: !mealRestrictionStatus.isAllowed,
    restrictionMessage,
    getBookingStatusForDate
  }
}
