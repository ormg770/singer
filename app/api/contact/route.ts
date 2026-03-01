import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const body = await request.json()
    const { name, email, subject, message, bot_challenge } = body

    // Honeypot check: If the bot filled out the hidden field, silently discard and pretend it worked
    if (bot_challenge) {
        return NextResponse.json({ success: true })
    }

    if (!name || !email || !message) {
        return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 })
    }

    const { error } = await supabase
        .from('contact_messages')
        .insert({ name, email, subject, message })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
}
