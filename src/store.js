import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice.js'
import eventsReducer from './eventsSlice.js'
import registrationsReducer from './registrationsSlice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    registrations: registrationsReducer
  }
})

store.subscribe(() => {
  const user = store.getState().auth.user
  if (user) localStorage.setItem('event-nest-user', JSON.stringify(user))
  else localStorage.removeItem('event-nest-user')
  localStorage.setItem('event-nest-registrations', JSON.stringify(store.getState().registrations.byUser))
})
