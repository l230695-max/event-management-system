import React from 'react'
import { Link, NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from './authSlice.js'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Events from './pages/Events.jsx'
import EventDetails from './pages/EventDetails.jsx'
import MyEvents from './pages/MyEvents.jsx'

function Header() {
  const user = useSelector(state => state.auth.user)
  const dispatch = useDispatch()

  return (
    <header className="site-header">
      <nav className="nav page" aria-label="Main navigation">
        <Link className="brand" to="/events"><span className="brand-mark">✦</span> Event Nest</Link>
        <div className="nav-links">
          <NavLink to="/events">Explore</NavLink>
          {user && <NavLink to="/my-events">My Events</NavLink>}
        </div>
        <div className="nav-account">
          {user ? <><span className="welcome">Hi, {user.name.split(' ')[0]}</span><button className="text-button" onClick={() => dispatch(logout())}>Log out</button></> : <><Link to="/login">Log in</Link><Link className="button small" to="/register">Sign up</Link></>}
        </div>
      </nav>
    </header>
  )
}

function Protected({ children }) {
  const user = useSelector(state => state.auth.user)
  const location = useLocation()
  return user ? children : <Navigate to="/login" state={{ from: location.pathname }} replace />
}

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/events" replace />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-events" element={<Protected><MyEvents /></Protected>} />
        <Route path="*" element={<main className="page"><h1>Page not found</h1><Link to="/events">Back to events</Link></main>} />
      </Routes>
      <footer className="site-footer"><div className="page">Event Nest · Built for Web Programming Assignment 2</div></footer>
    </>
  )
}
