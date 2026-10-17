import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { cancelRegistration, isPastEvent } from '../registrationsSlice.js'

function SavedEvent({ event, canCancel, onCancel }) {
  const date = event.localDate ? new Date(`${event.localDate}T${event.localTime || '12:00:00'}`) : null
  const displayDate = date ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', ...(event.localTime ? { timeStyle: 'short' } : {}) }).format(date) : 'Date to be announced'

  return (
    <article className="saved-event">
      {event.image ? <img src={event.image} alt="" /> : <div className="image-fallback">Event Nest</div>}
      <div className="saved-event-info">
        <span className="category-label">{event.category}</span>
        <h3><Link to={`/events/${event.id}`}>{event.name}</Link></h3>
        <p>{displayDate} · {event.venue}</p>
        <p>{event.location}</p>
      </div>
      {canCancel && <button className="outline-button" onClick={onCancel}>Cancel registration</button>}
    </article>
  )
}

export default function MyEvents() {
  const user = useSelector(state => state.auth.user)
  const events = useSelector(state => state.registrations.byUser[user.id] || [])
  const dispatch = useDispatch()
  const [message, setMessage] = useState('')
  const upcoming = events.filter(event => !isPastEvent(event))
  const completed = events.filter(isPastEvent)

  function cancel(eventId) {
    dispatch(cancelRegistration({ userId: user.id, eventId }))
    setMessage('Registration cancelled.')
  }

  return (
    <main className="page my-events-page">
      <p className="eyebrow">YOUR PLANS</p>
      <h1>My Events</h1>
      <p>All the events you registered for are here.</p>
      {message && <p className="success-message" role="status">{message}</p>}
      {events.length === 0 ? <div className="empty-panel"><h2>No events yet</h2><p>Explore upcoming events and save your favorites.</p><Link className="button" to="/events">Explore events</Link></div> : <>
        <section><h2>Upcoming <span className="count">{upcoming.length}</span></h2>{upcoming.length ? upcoming.map(event => <SavedEvent key={event.id} event={event} canCancel onCancel={() => cancel(event.id)} />) : <p className="muted">No upcoming events.</p>}</section>
        <section><h2>Completed <span className="count">{completed.length}</span></h2>{completed.length ? completed.map(event => <SavedEvent key={event.id} event={event} />) : <p className="muted">No completed events.</p>}</section>
      </>}
    </main>
  )
}
