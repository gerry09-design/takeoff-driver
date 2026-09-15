import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getSession } from '@/lib/session'

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const driverId = await getSession()
  if (!driverId) {
    return NextResponse.json({ ok: false, error: 'Not signed in' }, { status: 401 })
  }

  const { id } = await params

  const { error } = await supabaseAdmin
    .from('documents')
    .delete()
    .eq('id', id)
    .eq('driver_id', driverId)

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}