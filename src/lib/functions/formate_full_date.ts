export const formateFullDate = (date?: string) => {
  const _date = date ? new Date(date) : new Date()
  return _date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}
