import { Link } from 'react-router-dom'

export default function App() {
  return (
    <main className="page">
      <h1>Event Nest</h1>
      <p>Find an event worth remembering.</p>
      <Link to="/events">Explore events</Link>
    </main>
  )
}
