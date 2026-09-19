import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  if (cookieStore.get('admin_session')?.value !== 'true') {
    return NextResponse.json({ ok: false, error: 'Not authorised' }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin
    .from('drivers')
    .select('*')
    .neq('status', 'draft')
    .order('submitted_at', { ascending: false })

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, applications: data })
}