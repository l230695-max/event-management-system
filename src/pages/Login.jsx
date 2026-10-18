import React from 'react'
import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginAccount } from '../accountStorage.js'
import { setUser } from '../authSlice.js'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const user = useSelector(state => state.auth.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const nextPage = location.state?.from || '/events'

  if (user) return <Navigate to={nextPage} replace />

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setBusy(true)

    try {
      const account = await loginAccount(email, password)
      dispatch(setUser(account))
      navigate(nextPage, { replace: true })
    } catch (problem) {
      setError(problem.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">Welcome back</p>
        <h1>Log in</h1>
        <p>Save the events you want to attend.</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="login-email">Email</label>
          <input id="login-email" type="email" value={email} onChange={event => setEmail(event.target.value)} required autoComplete="email" />
          <label htmlFor="login-password">Password</label>
          <input id="login-password" type="password" value={password} onChange={event => setPassword(event.target.value)} required autoComplete="current-password" />
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button full-width" disabled={busy}>{busy ? 'Logging in...' : 'Log in'}</button>
        </form>
        <p className="auth-switch">New here? <Link to="/register" state={location.state}>Create an account</Link></p>
      </div>
    </main>
  )
}
