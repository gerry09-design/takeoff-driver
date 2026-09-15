import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getSession } from '@/lib/session'

export async function GET() {
  const driverId = await getSession()

  if (!driverId) {
    return NextResponse.json({ ok: false, error: 'Not signed in' }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin
    .from('drivers')
    .select('*')
    .eq('id', driverId)
    .single()

  if (error || !data) {
    return NextResponse.json({ ok: false, error: 'Driver not found' }, { status: 404 })
  }

  return NextResponse.json({ ok: true, driver: data })
}

export async function PATCH(req: NextRequest) {
  const driverId = await getSession()

  if (!driverId) {
    return NextResponse.json({ ok: false, error: 'Not signed in' }, { status: 401 })
  }

  const updates = await req.json()

  const { data, error } = await supabaseAdmin
    .from('drivers')
    .update(updates)
    .eq('id', driverId)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, driver: data })
}