export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-lg font-semibold mb-6 text-center">
          Driver Onboarding
        </h1>
        {children}
      </div>
    </div>
  )
}