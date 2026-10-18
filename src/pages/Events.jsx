import React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadEvents } from '../eventsSlice.js'
import EventCard from '../components/EventCard.jsx'

const categories = ['All', 'Music', 'Sports', 'Arts & Theatre', 'Film', 'Miscellaneous']

export default function Events() {
  const [searchText, setSearchText] = useState('')
  const [cityText, setCityText] = useState('')
  const [keyword, setKeyword] = useState('')
  const [city, setCity] = useState('')
  const [category, setCategory] = useState('All')
  const [page, setPage] = useState(0)
  const events = useSelector(state => state.events)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadEvents({ keyword, city, category: category === 'All' ? '' : category, page }))
  }, [dispatch, keyword, city, category, page])

  function handleSearch(event) {
    event.preventDefault()
    setKeyword(searchText.trim())
    setCity(cityText.trim())
    setPage(0)
  }

  function chooseCategory(value) {
    setCategory(value)
    setPage(0)
  }

  return (
    <main>
      <section className="hero">
        <div className="page hero-content">
          <p className="eyebrow">DISCOVER WHAT'S NEXT</p>
          <h1>Find your next<br /><span>great moment.</span></h1>
          <p>Explore upcoming concerts, games, shows, and more.</p>
          <form className="search-form" onSubmit={handleSearch}>
            <label className="sr-only" htmlFor="event-search">Search events</label>
            <input id="event-search" placeholder="Artist, team, or event" value={searchText} onChange={event => setSearchText(event.target.value)} />
            <label className="sr-only" htmlFor="city-search">City</label>
            <input id="city-search" placeholder="City (optional)" value={cityText} onChange={event => setCityText(event.target.value)} />
            <button className="button" type="submit">Search events</button>
          </form>
        </div>
      </section>

      <section className="page event-section">
        <div className="section-heading">
          <div><p className="eyebrow">EXPLORE EVENTS</p><h2>Upcoming events</h2></div>
          {events.listStatus === 'succeeded' && <p>{events.totalElements.toLocaleString()} events found</p>}
        </div>
        <div className="category-tabs" aria-label="Event categories">
          {categories.map(value => <button key={value} className={category === value ? 'active' : ''} onClick={() => chooseCategory(value)} aria-pressed={category === value}>{value}</button>)}
        </div>

        {events.listStatus === 'loading' && <p className="status-message" role="status">Loading events...</p>}
        {events.listStatus === 'failed' && <div className="status-message"><p role="alert">{events.listError}</p><button className="button" onClick={() => dispatch(loadEvents({ keyword, city, category: category === 'All' ? '' : category, page }))}>Try again</button></div>}
        {events.listStatus === 'succeeded' && events.items.length === 0 && <p className="status-message">No events match your search. Try a different keyword, city, or category.</p>}
        {events.listStatus === 'succeeded' && events.items.length > 0 && <div className="event-grid">{events.items.map(event => <EventCard key={event.id} event={event} />)}</div>}

        {events.listStatus === 'succeeded' && events.totalPages > 1 && <div className="pagination"><button disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button><span>Page {page + 1} of {events.totalPages}</span><button disabled={page + 1 >= events.totalPages} onClick={() => setPage(page + 1)}>Next</button></div>}
      </section>
    </main>
  )
}
