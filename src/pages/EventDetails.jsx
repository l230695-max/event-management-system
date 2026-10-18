import React from 'react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearSelected, loadEvent } from '../eventsSlice.js'
import { eventCategory, eventDate, eventImage, eventLocation, eventVenue } from '../eventHelpers.js'
import { cancelRegistration, isPastEvent, registerEvent } from '../registrationsSlice.js'

export default function EventDetails() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { selected: event, detailStatus, detailError } = useSelector(state => state.events)
  const user = useSelector(state => state.auth.user)
  const registrations = useSelector(state => user ? state.registrations.byUser[user.id] || [] : [])
  const [message, setMessage] = useState('')

  useEffect(() => {
    dispatch(loadEvent(id))
    return () => dispatch(clearSelected())
  }, [dispatch, id])

  if (detailStatus === 'loading' || detailStatus === 'idle') return <main className="page status-message" role="status">Loading event details...</main>
  if (detailStatus === 'failed') return <main className="page status-message"><p role="alert">{detailError}</p><Link to="/events">Back to events</Link></main>
  if (!event) return null

  const venue = eventVenue(event)
  const image = eventImage(event)
  const price = event.priceRanges?.[0]
  const registered = registrations.some(item => item.id === event.id)
  const past = isPastEvent({ dateTime: event.dates?.start?.dateTime, localDate: event.dates?.start?.localDate, localTime: event.dates?.start?.localTime })

  function handleRegistration() {
    dispatch(registerEvent({ userId: user.id, event }))
    setMessage('You are registered for this event.')
  }

  function handleCancellation() {
    dispatch(cancelRegistration({ userId: user.id, eventId: event.id }))
    setMessage('Registration cancelled.')
  }

  return (
    <main className="page detail-page">
      <Link className="back-link" to="/events">← Back to events</Link>
      <div className="detail-layout">
        <div>
          {image ? <img className="detail-image" src={image} alt="" /> : <div className="detail-image image-fallback">Event Nest</div>}
          <div className="detail-copy">
            <h2>About this event</h2>
            <p>{event.info || event.pleaseNote || 'More details are available on the official Ticketmaster page.'}</p>
            {event.info && event.pleaseNote && <p>{event.pleaseNote}</p>}
            {event.url && <a href={event.url} target="_blank" rel="noreferrer">Official Ticketmaster listing ↗</a>}
          </div>
        </div>
        <div className="detail-panel">
          <span className="category-label">{eventCategory(event)}</span>
          <h1>{event.name}</h1>
          <dl>
            <dt>Date and time</dt><dd>{eventDate(event)}</dd>
            <dt>Venue</dt><dd>{venue?.name || 'To be announced'}</dd>
            <dt>Location</dt><dd>{eventLocation(event)}</dd>
            {venue?.address?.line1 && <><dt>Address</dt><dd>{venue.address.line1}</dd></>}
            {price && <><dt>Ticket price</dt><dd>{price.min}–{price.max} {price.currency}</dd></>}
          </dl>
          {message && <p className="success-message" role="status">{message}</p>}
          {past ? <p className="muted">This event has already taken place.</p> : registered ? <><p className="registered-label">✓ You are registered</p><button className="outline-button full-width" onClick={handleCancellation}>Cancel registration</button></> : user ? <button className="button full-width" onClick={handleRegistration}>Register for event</button> : <Link className="button full-width" to="/login" state={{ from: `/events/${event.id}` }}>Log in to register</Link>}
        </div>
      </div>
    </main>
  )
}
