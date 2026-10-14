import { createSlice } from '@reduxjs/toolkit'

function savedUser() {
  try {
    return JSON.parse(localStorage.getItem('event-nest-user') || 'null')
  } catch {
    return null
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: savedUser() },
  reducers: {
    setUser(state, action) {
      state.user = action.payload
    },
    logout(state) {
      state.user = null
    }
  }
})

export const { setUser, logout } = authSlice.actions
export default authSlice.reducer
