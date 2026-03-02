import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const body = await request.json()
    const { email, name, bot_challenge } = body

    // Honeypot check: If the bot filled out the hidden field, silently discard and pretend it worked
    if (bot_challenge) {
        return NextResponse.json({ success: true })
    }

    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

    const { error } = await supabase
        .from('newsletter_subscribers')
        .upsert({ email, name }, { onConflict: 'email' })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
}
