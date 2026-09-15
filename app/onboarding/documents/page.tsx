'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const REQUIRED_DOCS = [
  { type: 'national_id', label: 'National ID / Passport' },
  { type: 'driver_licence', label: "Driver's Licence" },
  { type: 'vehicle_registration', label: 'Vehicle Registration' },
  { type: 'insurance', label: 'Insurance Certificate' },
  { type: 'profile_photo', label: 'Profile Photo' },
]

type Document = {
  id: string
  type: string
  file_name: string
  file_url: string
}

export default function DocumentsPage() {
  const router = useRouter()
  const [documents, setDocuments] = useState<Document[]>([])
  const [uploading, setUploading] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDocuments()
  }, [])

  async function fetchDocuments() {
    const res = await fetch('/api/driver/documents')
    const data = await res.json()
    if (data.ok) {
      setDocuments(data.documents)
    }
  }

  async function handleUpload(type: string, file: File) {
    setError('')
    setUploading(type)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    const res = await fetch('/api/driver/documents', {
      method: 'POST',
      body: formData,
    })
    const data = await res.json()
    setUploading(null)

    if (data.ok) {
      fetchDocuments()
    } else {
      setError(data.error || 'Upload failed')
    }
  }

  async function handleDelete(id: string) {
    await fetch('/api/driver/documents/' + id, { method: 'DELETE' })
    fetchDocuments()
  }

  function getDocForType(type: string) {
    return documents.find(function (d) {
      return d.type === type
    })
  }

  const allUploaded = REQUIRED_DOCS.every(function (doc) {
    return getDocForType(doc.type)
  })

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-1">Step 4 of 4</h2>
      <p className="text-sm text-gray-500 mb-4">Required Documents</p>

      <div className="space-y-4">
        {REQUIRED_DOCS.map(function (doc) {
          const uploaded = getDocForType(doc.type)
          return (
            <div key={doc.type} className="border rounded p-3">
              <p className="text-sm font-medium mb-2">{doc.label}</p>

              {uploaded ? (
                <div className="flex items-center justify-between bg-green-50 rounded p-2">
                  <a
                    href={uploaded.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 underline truncate"
                  >
                    {uploaded.file_name}
                  </a>
                  <button
                    onClick={function () {
                      handleDelete(uploaded.id)
                    }}
                    className="text-sm text-red-600 ml-2"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={function (e) {
                    const file = e.target.files ? e.target.files[0] : null
                    if (file) handleUpload(doc.type, file)
                  }}
                  disabled={uploading === doc.type}
                  className="text-sm"
                />
              )}

              {uploading === doc.type && (
                <p className="text-xs text-gray-500 mt-1">Uploading...</p>
              )}
            </div>
          )
        })}
      </div>

      {error && <p className="text-red-600 text-sm mt-3">{error}</p>}

      <button
        onClick={function () {
          router.push('/onboarding/review')
        }}
        disabled={!allUploaded}
        className="w-full bg-black text-white rounded p-2 mt-4 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  )
}