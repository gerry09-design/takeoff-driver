'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function IdentityPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    id_type: 'National ID',
    id_number: '',
    id_expiry: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleNext() {
    setError('')
    setLoading(true)

    const payload = {
      id_type: form.id_type,
      id_number: form.id_number,
      id_expiry: form.id_type === 'Passport' ? form.id_expiry : null,
    }

    const res = await fetch('/api/driver/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    setLoading(false)

    if (data.ok) {
      router.push('/onboarding/vehicle')
    } else {
      setError(data.error || 'Something went wrong')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-1">Step 2 of 4</h2>
      <p className="text-sm text-gray-500 mb-4">Identity Verification</p>

      <div className="space-y-3">
        <div>
          <label className="block text-sm mb-1">ID Type</label>
          <select
            value={form.id_type}
            onChange={(e) => handleChange('id_type', e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="National ID">National ID</option>
            <option value="Passport">Passport</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">ID Number</label>
          <input
            type="text"
            value={form.id_number}
            onChange={(e) => handleChange('id_number', e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        {form.id_type === 'Passport' && (
          <div>
            <label className="block text-sm mb-1">Passport Expiry Date</label>
            <input
              type="date"
              value={form.id_expiry}
              onChange={(e) => handleChange('id_expiry', e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>
        )}
      </div>

      {error && <p className="text-red-600 text-sm mt-3">{error}</p>}

      <button
        onClick={handleNext}
        disabled={loading || !form.id_number}
        className="w-full bg-black text-white rounded p-2 mt-4 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Next'}
      </button>
    </div>
  )
}