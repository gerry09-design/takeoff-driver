'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [demoCode, setDemoCode] = useState('')
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSendOtp() {
    setError('')
    setLoading(true)
    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    })
    const data = await res.json()
    setLoading(false)

    if (data.ok) {
      setDemoCode(data.demoCode)
      setStep('otp')
    } else {
      setError(data.error || 'Something went wrong')
    }
  }

  async function handleVerifyOtp() {
    setError('')
    setLoading(true)
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code }),
    })
    const data = await res.json()
    setLoading(false)

   if (data.ok) {
  if (data.status === 'draft') {
    router.push('/onboarding')
  } else {
    router.push('/status')
  }
} else {
  setError(data.error || 'Invalid code')
}
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow p-6">
        <h1 className="text-xl font-semibold mb-4">Driver Sign In</h1>

        {step === 'phone' && (
          <>
            <label className="block text-sm mb-1">Phone number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+263771234567"
              className="w-full border rounded p-2 mb-3"
            />
            <button
              onClick={handleSendOtp}
              disabled={loading || !phone}
              className="w-full bg-black text-white rounded p-2 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Code'}
            </button>
          </>
        )}

        {step === 'otp' && (
          <>
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded p-2 mb-3">
              Demo mode: your verification code is <strong>{demoCode}</strong>
            </div>
            <label className="block text-sm mb-1">Enter code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              className="w-full border rounded p-2 mb-3"
            />
            <button
              onClick={handleVerifyOtp}
              disabled={loading || !code}
              className="w-full bg-black text-white rounded p-2 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </>
        )}

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>
    </div>
  )
}