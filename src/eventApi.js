const baseUrl = 'https://app.ticketmaster.com/discovery/v2'

async function getJson(path, params = {}) {
  const key = import.meta.env.VITE_TICKETMASTER_API_KEY
  if (!key || key === 'your_ticketmaster_consumer_key') {
    throw new Error('Add your Ticketmaster Consumer Key to the .env file to load live events.')
  }

  const query = new URLSearchParams({ apikey: key, ...params })
  const response = await fetch(`${baseUrl}/${path}?${query}`)

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) throw new Error('Ticketmaster rejected the API key. Check your .env file.')
    if (response.status === 429) throw new Error('Ticketmaster is receiving too many requests. Please try again shortly.')
    throw new Error('Events could not be loaded. Please try again.')
  }

  return response.json()
}

export async function searchEvents(filters) {
  const params = {
    size: '12',
    page: String(filters.page || 0),
    sort: 'date,asc',
    startDateTime: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')
  }

  if (filters.keyword) params.keyword = filters.keyword
  if (filters.category) params.classificationName = filters.category
  if (filters.city) params.city = filters.city

  return getJson('events.json', params)
}

export function getEvent(id) {
  return getJson(`events/${encodeURIComponent(id)}.json`)
}
