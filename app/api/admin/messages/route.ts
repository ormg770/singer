import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const token = request.headers.get('x-admin-token')
    if (token !== process.env.ADMIN_PASSWORD) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
}

export async function DELETE(request: Request) {
    const token = request.headers.get('x-admin-token')
    if (token !== process.env.ADMIN_PASSWORD) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
