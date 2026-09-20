import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { setSession } from '@/lib/session'

export async function POST(req: NextRequest) {
  const { phone, code } = await req.json()

  if (!phone || !code) {
    return NextResponse.json({ ok: false, error: 'Phone and code required' }, { status: 400 })
  }

  // Find the latest unconsumed OTP for this phone
  const { data: otpRow, error: otpError } = await supabaseAdmin
    .from('otp_codes')
    .select('*')
    .eq('phone', phone)
    .eq('consumed', false)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (otpError || !otpRow) {
    return NextResponse.json({ ok: false, error: 'No pending code found' }, { status: 400 })
  }

  if (new Date(otpRow.expires_at) < new Date()) {
    return NextResponse.json({ ok: false, error: 'Code expired' }, { status: 400 })
  }

  if (otpRow.code !== code) {
    return NextResponse.json({ ok: false, error: 'Incorrect code' }, { status: 400 })
  }

  // Mark this OTP as consumed
  await supabaseAdmin.from('otp_codes').update({ consumed: true }).eq('id', otpRow.id)

  // Find or create the driver
  const { data: existingDriver } = await supabaseAdmin
    .from('drivers')
    .select('*')
    .eq('phone', phone)
    .single()

  let driverId: string
  let isNew = false

  if (existingDriver) {
    driverId = existingDriver.id
  } else {
    const { data: newDriver, error: createError } = await supabaseAdmin
      .from('drivers')
      .insert({ phone, status: 'draft' })
      .select()
      .single()

    if (createError || !newDriver) {
      return NextResponse.json({ ok: false, error: 'Could not create driver' }, { status: 500 })
    }

    driverId = newDriver.id
    isNew = true

    await supabaseAdmin.from('application_events').insert({
      driver_id: driverId,
      event: 'account_created',
    })
  }

  await setSession(driverId)

const { data: driverStatus } = await supabaseAdmin
  .from('drivers')
  .select('status')
  .eq('id', driverId)
  .single()

return NextResponse.json({ ok: true, isNew, status: driverStatus ? driverStatus.status : 'draft' })
}