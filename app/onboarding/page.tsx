'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PersonalDetailsPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    date_of_birth: '',
    address: '',
    city: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleNext() {
    setError('')
    setLoading(true)

    const res = await fetch('/api/driver/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setLoading(false)

    if (data.ok) {
      router.push('/onboarding/identity')
    } else {
      setError(data.error || 'Something went wrong')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-1">Step 1 of 4</h2>
      <p className="text-sm text-gray-500 mb-4">Personal & Contact Details</p>

      <div className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Full Name</label>
          <input
            type="text"
            value={form.full_name}
            onChange={(e) => handleChange('full_name', e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Date of Birth</label>
          <input
            type="date"
            value={form.date_of_birth}
            onChange={(e) => handleChange('date_of_birth', e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Address</label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">City</label>
          <input
            type="text"
            value={form.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
      </div>

      {error && <p className="text-red-600 text-sm mt-3">{error}</p>}

      <button
        onClick={handleNext}
        disabled={loading || !form.full_name}
        className="w-full bg-black text-white rounded p-2 mt-4 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Next'}
      </button>
    </div>
  )
}