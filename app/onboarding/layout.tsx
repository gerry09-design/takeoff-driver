'use client'

import { useRouter } from 'next/navigation'

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/signin')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-semibold">Driver Onboarding</h1>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-500 underline"
          >
            Logout
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}