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
    listRequestId: '',
    selected: null,
    detailStatus: 'idle',
    detailError: '',
    detailRequestId: ''
  },
  reducers: {
    clearSelected(state) {
      state.selected = null
      state.detailStatus = 'idle'
      state.detailError = ''
      state.detailRequestId = ''
    }
  },
  extraReducers: builder => {
    builder
      .addCase(loadEvents.pending, (state, action) => {
        state.listStatus = 'loading'
        state.listError = ''
        state.listRequestId = action.meta.requestId
      })
      .addCase(loadEvents.fulfilled, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) return
        state.listStatus = 'succeeded'
        state.items = action.payload._embedded?.events || []
        state.page = action.payload.page?.number || 0
        state.totalPages = action.payload.page?.totalPages || 0
        state.totalElements = action.payload.page?.totalElements || 0
      })
      .addCase(loadEvents.rejected, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) return
        state.listStatus = 'failed'
        state.listError = action.payload || 'Events could not be loaded.'
        state.items = []
      })
      .addCase(loadEvent.pending, (state, action) => {
        state.detailStatus = 'loading'
        state.detailError = ''
        state.selected = null
        state.detailRequestId = action.meta.requestId
      })
      .addCase(loadEvent.fulfilled, (state, action) => {
        if (state.detailRequestId !== action.meta.requestId) return
        state.detailStatus = 'succeeded'
        state.selected = action.payload
      })
      .addCase(loadEvent.rejected, (state, action) => {
        if (state.detailRequestId !== action.meta.requestId) return
        state.detailStatus = 'failed'
        state.detailError = action.payload || 'Event details could not be loaded.'
      })
  }
})

export const { clearSelected } = eventsSlice.actions
export default eventsSlice.reducer
