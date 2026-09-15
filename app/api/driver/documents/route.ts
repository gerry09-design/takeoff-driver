import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getSession } from '@/lib/session'

export async function POST(req: NextRequest) {
  const driverId = await getSession()
  if (!driverId) {
    return NextResponse.json({ ok: false, error: 'Not signed in' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File
  const type = formData.get('type') as string

  if (!file || !type) {
    return NextResponse.json({ ok: false, error: 'File and type required' }, { status: 400 })
  }

  const fileExt = file.name.split('.').pop()
  const filePath = `${driverId}/${type}-${Date.now()}.${fileExt}`

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const { error: uploadError } = await supabaseAdmin.storage
    .from('driver-documents')
    .upload(filePath, buffer, { contentType: file.type })

  if (uploadError) {
    return NextResponse.json({ ok: false, error: uploadError.message }, { status: 500 })
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from('driver-documents')
    .getPublicUrl(filePath)

  const { data: docRow, error: dbError } = await supabaseAdmin
    .from('documents')
    .insert({
      driver_id: driverId,
      type,
      file_name: file.name,
      file_url: publicUrlData.publicUrl,
    })
    .select()
    .single()

  if (dbError) {
    return NextResponse.json({ ok: false, error: dbError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, document: docRow })
}

export async function GET() {
  const driverId = await getSession()
  if (!driverId) {
    return NextResponse.json({ ok: false, error: 'Not signed in' }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin
    .from('documents')
    .select('*')
    .eq('driver_id', driverId)
    .order('uploaded_at', { ascending: true })

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, documents: data })
}