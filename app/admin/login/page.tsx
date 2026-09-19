'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setError('')
    setLoading(true)

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode: passcode }),
    })
    const data = await res.json()
    setLoading(false)

    if (data.ok) {
      router.push('/admin')
    } else {
      setError(data.error || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-sm w-full bg-white rounded-xl shadow p-6">
        <h1 className="text-lg font-semibold mb-4">Admin Login</h1>
        <label className="block text-sm mb-1">Passcode</label>
        <input
          type="password"
          value={passcode}
          onChange={function (e) {
            setPasscode(e.target.value)
          }}
          className="w-full border rounded p-2 mb-3"
        />
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        <button
          onClick={handleLogin}
          disabled={loading || !passcode}
          className="w-full bg-black text-white rounded p-2 disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </div>
    </div>
  )
}