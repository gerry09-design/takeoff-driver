import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'admin123'

export async function POST(req: NextRequest) {
  const { passcode } = await req.json()

  if (passcode !== ADMIN_PASSCODE) {
    return NextResponse.json({ ok: false, error: 'Incorrect passcode' }, { status: 401 })
  }

  const cookieStore = await cookies()
  cookieStore.set('admin_session', 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,
  })

  return NextResponse.json({ ok: true })
}