import test from 'node:test'
import assert from 'node:assert/strict'

const values = new Map()
globalThis.localStorage = {
  getItem(key) { return values.get(key) || null },
  setItem(key, value) { values.set(key, value) },
  removeItem(key) { values.delete(key) },
  clear() { values.clear() }
}

const { registerAccount, loginAccount } = await import('../src/accountStorage.js')
const { default: registrationReducer, registerEvent, cancelRegistration, isPastEvent } = await import('../src/registrationsSlice.js')

test('registration validates accounts and login checks passwords', async () => {
  localStorage.clear()
  await assert.rejects(registerAccount('A', 'bad-email', 'short'), /full name/)
  await assert.rejects(registerAccount('Alex Student', 'bad-email', 'Password123'), /valid email/)
  const user = await registerAccount('Alex Student', 'Alex@Example.com', 'Password123')
  assert.equal(user.email, 'alex@example.com')
  await assert.rejects(registerAccount('Alex Student', 'alex@example.com', 'Password123'), /already exists/)
  await assert.rejects(loginAccount('alex@example.com', 'WrongPassword'), /incorrect/)
  assert.equal((await loginAccount('ALEX@example.com', 'Password123')).id, user.id)
  assert.equal(JSON.parse(localStorage.getItem('event-nest-accounts'))[0].password, undefined)
})

test('registrations stay with their user and cannot be duplicated', () => {
  const future = new Date(Date.now() + 86400000).toISOString()
  const event = {
    id: 'event-1',
    name: 'Sample concert',
    dates: { start: { dateTime: future, localDate: future.slice(0, 10) } },
    classifications: [{ segment: { name: 'Music' } }],
    _embedded: { venues: [{ name: 'Sample Hall', city: { name: 'Lahore' } }] }
  }

  let state = registrationReducer({ byUser: {} }, registerEvent({ userId: 'user-1', event }))
  state = registrationReducer(state, registerEvent({ userId: 'user-1', event }))
  assert.equal(state.byUser['user-1'].length, 1)
  assert.equal(state.byUser['user-2'], undefined)
  state = registrationReducer(state, registerEvent({ userId: 'user-2', event }))
  assert.equal(state.byUser['user-2'].length, 1)
  state = registrationReducer(state, cancelRegistration({ userId: 'user-1', eventId: 'event-1' }))
  assert.equal(state.byUser['user-1'].length, 0)
  assert.equal(state.byUser['user-2'].length, 1)
})

test('completed events cannot be cancelled', () => {
  const past = new Date(Date.now() - 86400000).toISOString()
  const event = { id: 'old-event', name: 'Past show', dates: { start: { dateTime: past } } }
  let state = registrationReducer({ byUser: {} }, registerEvent({ userId: 'user-1', event }))
  assert.equal(isPastEvent(state.byUser['user-1'][0]), true)
  state = registrationReducer(state, cancelRegistration({ userId: 'user-1', eventId: 'old-event' }))
  assert.equal(state.byUser['user-1'].length, 1)
})
