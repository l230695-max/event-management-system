export function eventImage(event) {
  return event.images?.find(image => image.ratio === '16_9' && image.width >= 640)?.url || event.images?.[0]?.url || ''
}

export function eventCategory(event) {
  return event.classifications?.[0]?.segment?.name || 'Other'
}

export function eventVenue(event) {
  return event._embedded?.venues?.[0]
}

export function eventDate(event) {
  const date = event.dates?.start?.localDate
  const time = event.dates?.start?.localTime
  if (!date) return 'Date to be announced'
  const value = new Date(`${date}T${time || '12:00:00'}`)
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', ...(time ? { timeStyle: 'short' } : {}) }).format(value)
}

export function eventLocation(event) {
  const venue = eventVenue(event)
  return [venue?.city?.name, venue?.state?.stateCode || venue?.country?.name].filter(Boolean).join(', ') || 'Location to be announced'
}
