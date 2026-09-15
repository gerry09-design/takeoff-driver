import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  const { phone } = await req.json()

  if (!phone) {
    return NextResponse.json({ ok: false, error: 'Phone number required' }, { status: 400 })
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

  const { error } = await supabaseAdmin.from('otp_codes').insert({
    phone,
    code,
    expires_at: expiresAt,
  })

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  // Demo mode: return the code directly instead of sending real SMS
  return NextResponse.json({ ok: true, demoCode: code })
}