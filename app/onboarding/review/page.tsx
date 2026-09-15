'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type Driver = {
  full_name: string
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
}

type Document = {
  id: string
  type: string
  file_name: string
  file_url: string
}

export default function ReviewPage() {
  const router = useRouter()
  const [driver, setDriver] = useState<Driver | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const driverRes = await fetch('/api/driver/me')
    const driverData = await driverRes.json()
    if (driverData.ok) {
      setDriver(driverData.driver)
    }

    const docsRes = await fetch('/api/driver/documents')
    const docsData = await docsRes.json()
    if (docsData.ok) {
      setDocuments(docsData.documents)
    }
  }

  async function handleSubmit() {
    setError('')
    setSubmitting(true)

    const res = await fetch('/api/driver/submit', {
      method: 'POST',
    })
    const data = await res.json()
    setSubmitting(false)

    if (data.ok) {
      router.push('/submitted')
    } else {
      setError(data.error || 'Something went wrong')
    }
  }

  if (!driver) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-1">Review Application</h2>
      <p className="text-sm text-gray-500 mb-4">Check your details before submitting</p>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold">Personal & Contact</h3>
          <button
            onClick={function () {
              router.push('/onboarding')
            }}
            className="text-xs text-blue-600 underline"
          >
            Edit
          </button>
        </div>
        <p className="text-sm">{driver.full_name}</p>
        <p className="text-sm text-gray-600">{driver.email}</p>
        <p className="text-sm text-gray-600">{driver.date_of_birth}</p>
        <p className="text-sm text-gray-600">{driver.address}, {driver.city}</p>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold">Identity</h3>
          <button
            onClick={function () {
              router.push('/onboarding/identity')
            }}
            className="text-xs text-blue-600 underline"
          >
            Edit
          </button>
        </div>
        <p className="text-sm">{driver.id_type}: {driver.id_number}</p>
        {driver.id_expiry && (
          <p className="text-sm text-gray-600">Expires: {driver.id_expiry}</p>
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold">Vehicle</h3>
          <button
            onClick={function () {
              router.push('/onboarding/vehicle')
            }}
            className="text-xs text-blue-600 underline"
          >
            Edit
          </button>
        </div>
        <p className="text-sm">{driver.vehicle_type} - {driver.vehicle_make} {driver.vehicle_model} ({driver.vehicle_year})</p>
        <p className="text-sm text-gray-600">Plate: {driver.vehicle_plate}, Color: {driver.vehicle_color}</p>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold">Documents</h3>
          <button
            onClick={function () {
              router.push('/onboarding/documents')
            }}
            className="text-xs text-blue-600 underline"
          >
            Edit
          </button>
        </div>
        {documents.map(function (doc) {
          return (
            <p key={doc.id} className="text-sm text-gray-600">
              {doc.type}: {doc.file_name}
            </p>
          )
        })}
      </div>

      {error && <p className="text-red-600 text-sm mt-3">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full bg-black text-white rounded p-2 mt-4 disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit Application'}
      </button>
    </div>
  )
}