import { createSlice } from '@reduxjs/toolkit'
import { eventCategory, eventImage, eventLocation, eventVenue } from './eventHelpers.js'

function savedRegistrations() {
  try {
    const value = JSON.parse(localStorage.getItem('event-nest-registrations') || '{}')
    return value && typeof value === 'object' ? value : {}
  } catch {
    return {}
  }
}

export function isPastEvent(event) {
  const start = event.dateTime || (event.localDate ? `${event.localDate}T${event.localTime || '23:59:59'}` : '')
  return Boolean(start && new Date(start).getTime() < Date.now())
}

const registrationsSlice = createSlice({
  name: 'registrations',
  initialState: { byUser: savedRegistrations() },
  reducers: {
    registerEvent(state, action) {
      const { userId, event } = action.payload
      const list = state.byUser[userId] || []
      if (list.some(item => item.id === event.id)) return

      state.byUser[userId] = [...list, {
        id: event.id,
        name: event.name,
        image: eventImage(event),
        category: eventCategory(event),
        venue: eventVenue(event)?.name || 'To be announced',
        location: eventLocation(event),
        dateTime: event.dates?.start?.dateTime || '',
        localDate: event.dates?.start?.localDate || '',
        localTime: event.dates?.start?.localTime || '',
        registeredAt: new Date().toISOString()
      }]
    },
    cancelRegistration(state, action) {
      const { userId, eventId } = action.payload
      const list = state.byUser[userId] || []
      const item = list.find(event => event.id === eventId)
      if (item && !isPastEvent(item)) {
        state.byUser[userId] = list.filter(event => event.id !== eventId)
      }
    }
  }
})

export const { registerEvent, cancelRegistration } = registrationsSlice.actions
export default registrationsSlice.reducer
