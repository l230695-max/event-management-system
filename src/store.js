import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer
  }
})

store.subscribe(() => {
  const user = store.getState().auth.user
  if (user) localStorage.setItem('event-nest-user', JSON.stringify(user))
  else localStorage.removeItem('event-nest-user')
})
