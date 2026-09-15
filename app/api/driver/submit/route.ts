import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getSession } from '@/lib/session'

export async function POST() {
  const driverId = await getSession()
  if (!driverId) {
    return NextResponse.json({ ok: false, error: 'Not signed in' }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin
    .from('drivers')
    .update({
      status: 'pending',
      submitted_at: new Date().toISOString(),
    })
    .eq('id', driverId)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  await supabaseAdmin.from('application_events').insert({
    driver_id: driverId,
    event: 'submitted',
  })

  return NextResponse.json({ ok: true, driver: data })
}