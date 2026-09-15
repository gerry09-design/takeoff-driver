'use client'

import { useRouter } from 'next/navigation'

export default function SubmittedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-sm w-full bg-white rounded-xl shadow p-6 text-center">
        <div className="text-4xl mb-3">✅</div>
        <h1 className="text-lg font-semibold mb-2">Application Submitted</h1>
        <p className="text-sm text-gray-600 mb-4">
          Thank you for applying. We will review your application and notify you once a decision has been made.
        </p>
        <button
          onClick={function () {
            router.push('/status')
          }}
          className="w-full bg-black text-white rounded p-2"
        >
          Check Status
        </button>
      </div>
    </div>
  )
}