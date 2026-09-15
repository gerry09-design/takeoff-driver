import { cookies } from 'next/headers'

const COOKIE_NAME = 'driver_id'

export async function setSession(driverId: string) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, driverId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
}

export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(COOKIE_NAME)?.value ?? null
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}