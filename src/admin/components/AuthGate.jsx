import React, { useState } from 'react'
import styles from './AuthGate.module.css'

const AUTH_KEY = 'admin_authenticated'

export const isAuthenticated = () => sessionStorage.getItem(AUTH_KEY) === 'true'
export const logout = () => sessionStorage.removeItem(AUTH_KEY)

const AuthGate = ({ children }) => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [authed, setAuthed] = useState(isAuthenticated())

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, 'true')
      setAuthed(true)
      setError('')
    } else {
      setError('Incorrect password')
    }
  }

  if (authed) return children

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Admin Login</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter admin password"
          className={styles.input}
          autoFocus
        />
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.button}>Login</button>
      </form>
    </div>
  )
}

export default AuthGate
