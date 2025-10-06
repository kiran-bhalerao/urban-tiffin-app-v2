export function isDatePassed(
  inputDate: Date | undefined,
  excludeCurrentDay = false
): boolean {
  if (!inputDate) return false
  const today = new Date()

  // Clear the time part to ensure only the date is compared
  today.setHours(0, 0, 0, 0)
  inputDate.setHours(0, 0, 0, 0)

  if (excludeCurrentDay) {
    return inputDate >= today
  }

  return inputDate > today
}
