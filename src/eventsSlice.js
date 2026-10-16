import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getEvent, searchEvents } from './eventApi.js'

export const loadEvents = createAsyncThunk('events/loadEvents', async (filters, api) => {
  try {
    return await searchEvents(filters)
  } catch (error) {
    return api.rejectWithValue(error.message)
  }
})

export const loadEvent = createAsyncThunk('events/loadEvent', async (id, api) => {
  try {
    return await getEvent(id)
  } catch (error) {
    return api.rejectWithValue(error.message)
  }
})

const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    items: [],
    listStatus: 'idle',
    listError: '',
    page: 0,
    totalPages: 0,
    totalElements: 0,
    selected: null,
    detailStatus: 'idle',
    detailError: ''
  },
  reducers: {
    clearSelected(state) {
      state.selected = null
      state.detailStatus = 'idle'
      state.detailError = ''
    }
  },
  extraReducers: builder => {
    builder
      .addCase(loadEvents.pending, state => {
        state.listStatus = 'loading'
        state.listError = ''
      })
      .addCase(loadEvents.fulfilled, (state, action) => {
        state.listStatus = 'succeeded'
        state.items = action.payload._embedded?.events || []
        state.page = action.payload.page?.number || 0
        state.totalPages = action.payload.page?.totalPages || 0
        state.totalElements = action.payload.page?.totalElements || 0
      })
      .addCase(loadEvents.rejected, (state, action) => {
        state.listStatus = 'failed'
        state.listError = action.payload || 'Events could not be loaded.'
        state.items = []
      })
      .addCase(loadEvent.pending, state => {
        state.detailStatus = 'loading'
        state.detailError = ''
        state.selected = null
      })
      .addCase(loadEvent.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded'
        state.selected = action.payload
      })
      .addCase(loadEvent.rejected, (state, action) => {
        state.detailStatus = 'failed'
        state.detailError = action.payload || 'Event details could not be loaded.'
      })
  }
})

export const { clearSelected } = eventsSlice.actions
export default eventsSlice.reducer
