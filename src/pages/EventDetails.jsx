import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearSelected, loadEvent } from '../eventsSlice.js'
import { eventCategory, eventDate, eventImage, eventLocation, eventVenue } from '../eventHelpers.js'

export default function EventDetails() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { selected: event, detailStatus, detailError } = useSelector(state => state.events)

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
        </div>
      </div>
    </main>
  )
}
