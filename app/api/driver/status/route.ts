import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getSession } from '@/lib/session'

export async function GET() {
  const driverId = await getSession()
  if (!driverId) {
    return NextResponse.json({ ok: false, error: 'Not signed in' }, { status: 401 })
  }

  const { data: driver, error: driverError } = await supabaseAdmin
    .from('drivers')
    .select('*')
    .eq('id', driverId)
    .single()

  if (driverError || !driver) {
    return NextResponse.json({ ok: false, error: 'Driver not found' }, { status: 404 })
  }

  const { data: events, error: eventsError } = await supabaseAdmin
    .from('application_events')
    .select('*')
    .eq('driver_id', driverId)
    .order('created_at', { ascending: true })

  if (eventsError) {
    return NextResponse.json({ ok: false, error: eventsError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, driver: driver, events: events })
}