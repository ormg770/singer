import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

function isAuthorized(req: NextRequest) {
    const token = req.headers.get('x-admin-token')
    return token === process.env.ADMIN_PASSWORD
}

export async function GET(req: NextRequest) {
    if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase.from('site_settings').select('*')
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Convert array to key-value object
    const settings: Record<string, string> = {}
    data?.forEach((row) => { settings[row.key] = row.value })
    return NextResponse.json(settings)
}

export async function PUT(req: NextRequest) {
    if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const updates: Record<string, string> = await req.json()

    for (const [key, value] of Object.entries(updates)) {
        const { error } = await supabase
            .from('site_settings')
            .upsert({ key, value }, { onConflict: 'key' })
        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
