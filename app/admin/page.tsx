'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type Application = {
  id: string
  full_name: string
  phone: string
  vehicle_type: string
  status: string
  submitted_at: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(function () {
    loadApplications()
  }, [])

  async function loadApplications() {
  try {
    const res = await fetch('/api/admin/applications')
    if (res.status === 401) {
      router.push('/admin/login')
      return
    }
    const data = await res.json()
    if (data.ok) {
      setApplications(data.applications)
    } else {
      console.log('Error:', data.error)
    }
  } catch (err) {
    console.log('Fetch failed:', err)
  }
  setLoading(false)
}

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-lg font-semibold mb-4">Driver Applications</h1>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Vehicle</th>
                <th className="p-3">Status</th>
                <th className="p-3">Submitted</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {applications.map(function (app) {
                return (
                  <tr key={app.id} className="border-t">
                    <td className="p-3">{app.full_name}</td>
                    <td className="p-3">{app.phone}</td>
                    <td className="p-3">{app.vehicle_type}</td>
                    <td className="p-3 capitalize">{app.status}</td>
                    <td className="p-3">
                      {app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : '-'}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={function () {
                          router.push('/admin/' + app.id)
                        }}
                        className="text-blue-600 underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {applications.length === 0 && (
            <p className="p-6 text-sm text-gray-500 text-center">No applications yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}