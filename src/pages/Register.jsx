import React from 'react'
import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerAccount } from '../accountStorage.js'
import { setUser } from '../authSlice.js'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setBusy(true)

    try {
      const account = await registerAccount(name, email, password)
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
        <p className="eyebrow">Join Event Nest</p>
        <h1>Create an account</h1>
        <p>Keep your events together in one place.</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="register-name">Name</label>
          <input id="register-name" value={name} onChange={event => setName(event.target.value)} required minLength="2" autoComplete="name" />
          <label htmlFor="register-email">Email</label>
          <input id="register-email" type="email" value={email} onChange={event => setEmail(event.target.value)} required autoComplete="email" />
          <label htmlFor="register-password">Password</label>
          <input id="register-password" type="password" value={password} onChange={event => setPassword(event.target.value)} required minLength="8" autoComplete="new-password" />
          <small>Use at least 8 characters.</small>
          <label htmlFor="register-confirm">Confirm password</label>
          <input id="register-confirm" type="password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} required autoComplete="new-password" />
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button full-width" disabled={busy}>{busy ? 'Creating account...' : 'Create account'}</button>
        </form>
        <p className="auth-switch">Already registered? <Link to="/login" state={location.state}>Log in</Link></p>
      </div>
    </main>
  )
}
