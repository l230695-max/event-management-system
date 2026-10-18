import React from 'react'
import { Link } from 'react-router-dom'
import { eventCategory, eventDate, eventImage, eventLocation } from '../eventHelpers.js'

export default function EventCard({ event }) {
  const image = eventImage(event)

  return (
    <article className="event-card">
      {image ? <img src={image} alt="" loading="lazy" /> : <div className="image-fallback">Event Nest</div>}
      <div className="event-card-body">
        <span className="category-label">{eventCategory(event)}</span>
        <h3><Link to={`/events/${event.id}`}>{event.name}</Link></h3>
        <p>{eventDate(event)}</p>
        <p>{eventLocation(event)}</p>
        <Link className="card-link" to={`/events/${event.id}`}>View details <span aria-hidden="true">→</span></Link>
      </div>
    </article>
  )
}
