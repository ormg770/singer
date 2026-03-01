import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
    const { data, error } = await supabase.from('site_settings').select('*')
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const settings: Record<string, string> = {}
    data?.forEach((row) => { settings[row.key] = row.value })
    return NextResponse.json(settings)
}
