'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function VehiclePage() {
  const router = useRouter()
  const [form, setForm] = useState({
    vehicle_type: 'Motorbike',
    vehicle_make: '',
    vehicle_model: '',
    vehicle_year: '',
    vehicle_plate: '',
    vehicle_color: '',
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
      body: JSON.stringify({
        ...form,
        vehicle_year: form.vehicle_year ? parseInt(form.vehicle_year) : null,
      }),
    })
    const data = await res.json()
    setLoading(false)

    if (data.ok) {
      router.push('/onboarding/documents')
    } else {
      setError(data.error || 'Something went wrong')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-1">Step 3 of 4</h2>
      <p className="text-sm text-gray-500 mb-4">Vehicle Details</p>

      <div className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Vehicle Type</label>
          <select
            value={form.vehicle_type}
            onChange={(e) => handleChange('vehicle_type', e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="Motorbike">Motorbike</option>
            <option value="Car">Car</option>
            <option value="Van">Van</option>
            <option value="truck">truck</option>
            <option value="Bicycle">Bicycle</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Make</label>
          <input
            type="text"
            value={form.vehicle_make}
            onChange={(e) => handleChange('vehicle_make', e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Model</label>
          <input
            type="text"
            value={form.vehicle_model}
            onChange={(e) => handleChange('vehicle_model', e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
  <label className="block text-sm mb-1">Year</label>
  <select
    value={form.vehicle_year}
    onChange={(e) => handleChange('vehicle_year', e.target.value)}
    className="w-full border rounded p-2"
  >
    <option value="">Select year</option>
    {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((year) => (
      <option key={year} value={year}>
        {year}
      </option>
    ))}
  </select>
</div>

        <div>
          <label className="block text-sm mb-1">Plate Number</label>
          <input
            type="text"
            value={form.vehicle_plate}
            onChange={(e) => handleChange('vehicle_plate', e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Color</label>
          <input
            type="text"
            value={form.vehicle_color}
            onChange={(e) => handleChange('vehicle_color', e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
      </div>

      {error && <p className="text-red-600 text-sm mt-3">{error}</p>}

      <button
        onClick={handleNext}
        disabled={loading || !form.vehicle_plate}
        className="w-full bg-black text-white rounded p-2 mt-4 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Next'}
      </button>
    </div>
  )
}