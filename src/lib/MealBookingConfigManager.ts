type MealType = 'breakfast' | 'lunch' | 'dinner'

interface MealBookingRule {
  mealType: MealType
  cutoffHour: number // 24-hour format (e.g., 17 for 5 PM, -7 for yesterday 5 PM)
}

interface MealBookingConfig {
  today: MealBookingRule[]
  tomorrow: MealBookingRule[]
}

interface MealCancellationConfig {
  today: number // cutoff hour for today's meals (e.g., -7 for yesterday 5 PM)
  tomorrow: number // cutoff hour for tomorrow's meals (e.g., 11 for 11 AM today)
}

interface MealBookingStatus {
  allowed: boolean
  reason?: string
  cutoffTime?: string
}

interface MealRestrictionStatus {
  isAllowed: boolean
  reason?: string
  cutoffTime?: string
}

// Default hardcoded configuration based on kitchen operational hours (8 AM - 5 PM)
export const defaultMealBookingConfig: MealBookingConfig = {
  today: [
    {
      mealType: 'breakfast',
      cutoffHour: -7 // Yesterday 5 PM (17 - 24 = -7)
    },
    {
      mealType: 'lunch',
      cutoffHour: 9 // Can book until 9 AM today
    },
    {
      mealType: 'dinner',
      cutoffHour: 12 // Can book until 12 PM (noon) today
    }
  ],
  tomorrow: [
    {
      mealType: 'breakfast',
      cutoffHour: 17 // Can book until 5 PM today
    },
    {
      mealType: 'lunch',
      cutoffHour: 17 // Can book until 5 PM today
    },
    {
      mealType: 'dinner',
      cutoffHour: 17 // Can book until 5 PM today
    }
  ]
}

// Default meal cancellation configuration
// Simplified: single cutoff time for all meals per day
export const defaultMealCancellationConfig: MealCancellationConfig = {
  today: -7, // Yesterday 5 PM (17 - 24 = -7) - can't cancel today's meals after yesterday 5 PM
  tomorrow: 17 // 5 PM today - can cancel tomorrow's meals until 5 PM today
}

export class MealBookingConfigManager {
  private config: MealBookingConfig
  private cancellationConfig: MealCancellationConfig

  constructor(
    initialConfig: MealBookingConfig,
    initialCancellationConfig: MealCancellationConfig
  ) {
    this.config = initialConfig
    this.cancellationConfig = initialCancellationConfig
  }

  setConfig(config: MealBookingConfig): void {
    this.config = config
  }

  getConfig(): MealBookingConfig {
    return this.config
  }

  setCancellationConfig(config: MealCancellationConfig): void {
    this.cancellationConfig = config
  }

  getCancellationConfig(): MealCancellationConfig {
    return this.cancellationConfig
  }

  isMealBookingAllowed(mealType: MealType, targetDate: Date): boolean {
    const status = this.getMealBookingStatus(mealType, targetDate)
    return status.allowed
  }

  getMealBookingStatus(
    mealType: MealType,
    targetDate: Date
  ): MealBookingStatus {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
    const targetDateOnly = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate()
    )

    let rules: MealBookingRule[]

    if (targetDateOnly.getTime() === today.getTime()) {
      rules = this.config.today
    } else if (targetDateOnly.getTime() === tomorrow.getTime()) {
      rules = this.config.tomorrow
    } else {
      // For dates beyond tomorrow, allow booking
      return { allowed: true }
    }

    const rule = rules.find(r => r.mealType === mealType)
    if (!rule) {
      return { allowed: true }
    }

    const cutoffTime = new Date()
    if (rule.cutoffHour < 0) {
      // Negative hour means previous day
      cutoffTime.setDate(cutoffTime.getDate() - 1)
      cutoffTime.setHours(24 + rule.cutoffHour, 0, 0, 0)
    } else {
      cutoffTime.setHours(rule.cutoffHour, 0, 0, 0)
    }

    const allowed = now <= cutoffTime
    const cutoffTimeString = cutoffTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })

    if (allowed) {
      return {
        allowed: true,
        cutoffTime: cutoffTimeString
      }
    } else {
      let reason: string

      if (targetDateOnly.getTime() === today.getTime()) {
        // For today's meals
        if (rule.cutoffHour < 0) {
          // Negative hour means cutoff was yesterday
          const actualHour = 24 + rule.cutoffHour
          const timeString = new Date().setHours(actualHour, 0, 0, 0)
          const yesterdayTimeString = new Date(timeString).toLocaleTimeString(
            'en-US',
            {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            }
          )
          reason = `${
            mealType.charAt(0).toUpperCase() + mealType.slice(1)
          } booking for today is closed. Meals must be booked before yesterday ${yesterdayTimeString}`
        } else {
          reason = `${
            mealType.charAt(0).toUpperCase() + mealType.slice(1)
          } booking for today is closed. Meals must be booked before ${cutoffTimeString}`
        }
      } else {
        // For tomorrow's meals
        reason = `${
          mealType.charAt(0).toUpperCase() + mealType.slice(1)
        } booking for tomorrow is closed. Meals must be booked before ${cutoffTimeString}`
      }

      return {
        allowed: false,
        reason,
        cutoffTime: cutoffTimeString
      }
    }
  }

  // Utility method to get restriction status for hook
  getMealRestrictionStatus(
    activeDay: string | undefined,
    tab: MealType
  ): MealRestrictionStatus {
    if (!activeDay) {
      return { isAllowed: true }
    }

    const targetDate = new Date(activeDay)
    const mealType: MealType = tab === 'lunch' ? 'lunch' : 'dinner'

    const status = this.getMealBookingStatus(mealType, targetDate)
    return {
      isAllowed: status.allowed,
      reason: status.reason,
      cutoffTime: status.cutoffTime
    }
  }

  // Utility method to get restriction message
  getRestrictionMessage(
    restrictionStatus: MealRestrictionStatus
  ): string | null {
    if (restrictionStatus.isAllowed) {
      return null
    }
    return restrictionStatus.reason || 'Booking not allowed for this meal'
  }

  // Meal Cancellation Methods
  isMealCancellationAllowed(mealType: MealType, targetDate: Date): boolean {
    const status = this.getMealCancellationStatus(mealType, targetDate)
    return status.allowed
  }

  getMealCancellationStatus(
    mealType: MealType,
    targetDate: Date
  ): MealBookingStatus {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
    const targetDateOnly = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate()
    )

    let cutoffHour: number

    if (targetDateOnly.getTime() === today.getTime()) {
      cutoffHour = this.cancellationConfig.today
    } else if (targetDateOnly.getTime() === tomorrow.getTime()) {
      cutoffHour = this.cancellationConfig.tomorrow
    } else {
      return {
        allowed: true
      }
    }

    const cutoffTime = new Date()
    if (cutoffHour < 0) {
      // Negative hour means previous day
      cutoffTime.setDate(cutoffTime.getDate() - 1)
      cutoffTime.setHours(24 + cutoffHour, 0, 0, 0)
    } else if (
      targetDateOnly.getTime() === tomorrow.getTime() &&
      cutoffHour <= 23
    ) {
      // For tomorrow's meals, check if cutoff is today
      cutoffTime.setHours(cutoffHour, 0, 0, 0)
    } else {
      // For today's meals or tomorrow's meals with cutoff tomorrow
      cutoffTime.setDate(targetDateOnly.getDate())
      cutoffTime.setHours(cutoffHour, 0, 0, 0)
    }

    const allowed = now <= cutoffTime
    const cutoffTimeString = cutoffTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })

    if (allowed) {
      return {
        allowed: true,
        cutoffTime: cutoffTimeString
      }
    } else {
      let reason: string
      const mealTypeCapitalized =
        mealType.charAt(0).toUpperCase() + mealType.slice(1)

      if (targetDateOnly.getTime() === today.getTime()) {
        // For today's meals
        if (cutoffHour < 0) {
          // Negative hour means cutoff was yesterday
          const actualHour = 24 + cutoffHour
          const timeString = new Date().setHours(actualHour, 0, 0, 0)
          const yesterdayTimeString = new Date(timeString).toLocaleTimeString(
            'en-US',
            {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            }
          )
          reason = `Meal cancellation for today is closed. Meals must be cancelled before yesterday ${yesterdayTimeString}`
        } else {
          reason = `Meal cancellation for today is closed. Meals must be cancelled before ${cutoffTimeString}`
        }
      } else {
        // For tomorrow's meals
        const cutoffDate =
          cutoffTime.toDateString() === today.toDateString()
            ? 'today'
            : 'tomorrow'
        reason = `Meal cancellation for tomorrow is closed. Meals must be cancelled before ${cutoffTimeString} ${cutoffDate}`
      }

      return {
        allowed: false,
        reason,
        cutoffTime: cutoffTimeString
      }
    }
  }

  // Utility method to get cancellation restriction status for a specific date and meal
  getMealCancellationRestrictionStatus(
    targetDate: Date,
    mealType: MealType
  ): MealRestrictionStatus {
    const status = this.getMealCancellationStatus(mealType, targetDate)
    return {
      isAllowed: status.allowed,
      reason: status.reason,
      cutoffTime: status.cutoffTime
    }
  }
}
