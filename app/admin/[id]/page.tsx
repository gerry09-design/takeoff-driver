'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

type Driver = {
  id: string
  full_name: string
  phone: string
  email: string
  date_of_birth: string
  address: string
  city: string
  id_type: string
  id_number: string
  id_expiry: string | null
  vehicle_type: string
  vehicle_make: string
  vehicle_model: string
  vehicle_year: number
  vehicle_plate: string
  vehicle_color: string
  status: string
  rejection_reason: string | null
}

type DocumentItem = {
  id: string
  type: string
  file_name: string
  file_url: string
}

export default function AdminApplicationDetail() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [driver, setDriver] = useState<Driver | null>(null)
  const [documents, setDocuments] = useState<DocumentItem[]>([])
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectBox, setShowRejectBox] = useState(false)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(function () {
    loadDetail()
  }, [])

  async function loadDetail() {
    const res = await fetch('/api/admin/applications/' + id)
    if (res.status === 401) {
      router.push('/admin/login')
      return
    }
    const data = await res.json()
    if (data.ok) {
      setDriver(data.driver)
      setDocuments(data.documents)
    }
    setLoading(false)
  }

  async function handleAction(action: string) {
    setError('')

    if (action === 'reject' && !rejectReason) {
      setShowRejectBox(true)
      return
    }

    setActionLoading(true)
    const res = await fetch('/api/admin/applications/' + id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: action, reason: rejectReason }),
    })
    const data = await res.json()
    setActionLoading(false)

    if (data.ok) {
      loadDetail()
      setShowRejectBox(false)
    } else {
      setError(data.error || 'Action failed')
    }
  }

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading...</div>
  }

  if (!driver) {
    return <div className="p-6 text-sm text-gray-500">Not found.</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-6">
        <button
          onClick={function () {
            router.push('/admin')
          }}
          className="text-sm text-blue-600 underline mb-4"
        >
          Back to list
        </button>

        <h1 className="text-lg font-semibold mb-1">{driver.full_name}</h1>
        <p className="text-sm text-gray-500 mb-4">Status: {driver.status}</p>

        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-1">Personal & Contact</h3>
          <p className="text-sm">{driver.phone}</p>
          <p className="text-sm">{driver.email}</p>
          <p className="text-sm">{driver.date_of_birth}</p>
          <p className="text-sm">{driver.address}, {driver.city}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-1">Identity</h3>
          <p className="text-sm">{driver.id_type}: {driver.id_number}</p>
          {driver.id_expiry && <p className="text-sm">Expires: {driver.id_expiry}</p>}
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-1">Vehicle</h3>
          <p className="text-sm">
            {driver.vehicle_type} - {driver.vehicle_make} {driver.vehicle_model} ({driver.vehicle_year})
          </p>
          <p className="text-sm">Plate: {driver.vehicle_plate}, Color: {driver.vehicle_color}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-1">Documents</h3>
          {documents.map(function (doc) {
            return (
                <a
                key={doc.id}
                href={doc.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-blue-600 underline"
              >
                {doc.type}: {doc.file_name}

              </a>
            )
          })}
        </div>

        {driver.status === 'pending' && (
          <div className="border-t pt-4">
            {showRejectBox && (
              <div className="mb-3">
                <label className="block text-sm mb-1">Rejection reason</label>
                <textarea
                  value={rejectReason}
                  onChange={function (e) {
                    setRejectReason(e.target.value)
                  }}
                  className="w-full border rounded p-2 text-sm"
                  rows={3}
                />
              </div>
            )}

            {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

            <div className="flex gap-2">
              <button
                onClick={function () {
                  handleAction('approve')
                }}
                disabled={actionLoading}
                className="flex-1 bg-green-600 text-white rounded p-2 disabled:opacity-50"
              >
                Approve
              </button>
              <button
                onClick={function () {
                  handleAction('reject')
                }}
                disabled={actionLoading}
                className="flex-1 bg-red-600 text-white rounded p-2 disabled:opacity-50"
              >
                {showRejectBox ? 'Confirm Reject' : 'Reject'}
              </button>
            </div>
          </div>
        )}

        {driver.status === 'approved' && (
          <p className="text-sm text-green-700 font-medium">This application has been approved.</p>
        )}

        {driver.status === 'rejected' && (
          <p className="text-sm text-red-700 font-medium">
            Rejected. Reason: {driver.rejection_reason}
          </p>
        )}
      </div>
    </div>
  )
}