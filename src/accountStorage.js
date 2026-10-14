const accountsKey = 'event-nest-accounts'

function readAccounts() {
  try {
    return JSON.parse(localStorage.getItem(accountsKey) || '[]')
  } catch {
    return []
  }
}

async function passwordHash(password, salt) {
  const data = new TextEncoder().encode(salt + password)
  const result = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(result)).map(number => number.toString(16).padStart(2, '0')).join('')
}

export async function registerAccount(name, email, password) {
  const accounts = readAccounts()
  const cleanName = name.trim()
  const cleanEmail = email.trim().toLowerCase()

  if (cleanName.length < 2) throw new Error('Please enter your full name.')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) throw new Error('Please enter a valid email address.')
  if (password.length < 8) throw new Error('Password must have at least 8 characters.')
  if (accounts.some(account => account.email === cleanEmail)) throw new Error('An account with this email already exists.')

  const salt = Array.from(crypto.getRandomValues(new Uint8Array(16))).map(number => number.toString(16).padStart(2, '0')).join('')
  const account = {
    id: crypto.randomUUID(),
    name: cleanName,
    email: cleanEmail,
    salt,
    passwordHash: await passwordHash(password, salt)
  }

  localStorage.setItem(accountsKey, JSON.stringify([...accounts, account]))
  return { id: account.id, name: account.name, email: account.email }
}

export async function loginAccount(email, password) {
  const cleanEmail = email.trim().toLowerCase()
  const account = readAccounts().find(item => item.email === cleanEmail)

  if (!account || account.passwordHash !== await passwordHash(password, account.salt)) {
    throw new Error('Email or password is incorrect.')
  }

  return { id: account.id, name: account.name, email: account.email }
}
