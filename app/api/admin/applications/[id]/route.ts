import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { cookies } from 'next/headers'

async function isAdmin() {
  const cookieStore = await cookies()
  return cookieStore.get('admin_session')?.value === 'true'
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: 'Not authorised' }, { status: 401 })
  }

  const { id } = await params

  const { data: driver, error } = await supabaseAdmin
    .from('drivers')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !driver) {
    return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 })
  }

  const { data: documents } = await supabaseAdmin
    .from('documents')
    .select('*')
    .eq('driver_id', id)

  const { data: events } = await supabaseAdmin
    .from('application_events')
    .select('*')
    .eq('driver_id', id)
    .order('created_at', { ascending: true })

  return NextResponse.json({ ok: true, driver: driver, documents: documents, events: events })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: 'Not authorised' }, { status: 401 })
  }

  const { id } = await params
  const { action, reason } = await req.json()

  if (action !== 'approve' && action !== 'reject') {
    return NextResponse.json({ ok: false, error: 'Invalid action' }, { status: 400 })
  }

  if (action === 'reject' && !reason) {
    return NextResponse.json({ ok: false, error: 'Rejection reason required' }, { status: 400 })
  }

  const updates =
    action === 'approve'
      ? { status: 'approved', reviewed_at: new Date().toISOString(), rejection_reason: null }
      : { status: 'rejected', reviewed_at: new Date().toISOString(), rejection_reason: reason }

  const { error } = await supabaseAdmin.from('drivers').update(updates).eq('id', id)

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  await supabaseAdmin.from('application_events').insert({
    driver_id: id,
    event: action === 'approve' ? 'approved' : 'rejected',
    note: action === 'reject' ? reason : null,
  })

  return NextResponse.json({ ok: true })
}