'use client'

import { useState, useEffect } from 'react'

type Driver = {
  status: string
  rejection_reason: string | null
}

type Event = {
  id: string
  event: string
  created_at: string
}

const EVENT_LABELS: Record<string, string> = {
  account_created: 'Account Created',
  personal_submitted: 'Personal Details Submitted',
  identity_submitted: 'Identity Submitted',
  vehicle_submitted: 'Vehicle Submitted',
  documents_uploaded: 'Documents Uploaded',
  submitted: 'Application Submitted',
  approved: 'Approved',
  rejected: 'Rejected',
}

export default function StatusPage() {
  const [driver, setDriver] = useState<Driver | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(function () {
    loadStatus()
  }, [])

  async function loadStatus() {
    const res = await fetch('/api/driver/status')
    const data = await res.json()
    if (data.ok) {
      setDriver(data.driver)
      setEvents(data.events)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!driver) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <p className="text-sm text-gray-500">No application found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-sm w-full bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
  <h1 className="text-lg font-semibold">Application Status</h1>
  <button
    onClick={function () {
      fetch('/api/auth/logout', { method: 'POST' }).then(function () {
        window.location.href = '/signin'
      })
    }}
    className="text-xs text-gray-500 underline"
  >
    Logout
  </button>
</div>
        <div className="space-y-2 mb-4">
          {events.map(function (evt) {
            return (
              <div key={evt.id} className="flex items-center text-sm">
                <span className="text-green-600 mr-2">✓</span>
                <span>{EVENT_LABELS[evt.event] || evt.event}</span>
              </div>
            )
          })}

          {driver.status === 'pending' && (
            <div className="flex items-center text-sm text-yellow-600">
              <span className="mr-2">⏳</span>
              <span>Under Review</span>
            </div>
          )}
        </div>

        {driver.status === 'approved' && (
          <div className="bg-green-50 border border-green-200 rounded p-3 text-sm text-green-800">
            Approved. You can start accepting deliveries.
          </div>
        )}

        {driver.status === 'rejected' && (
          <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-800">
            Application rejected. Reason: {driver.rejection_reason}
          </div>
        )}
      </div>
    </div>
  )
}