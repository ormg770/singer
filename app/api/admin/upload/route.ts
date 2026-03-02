import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

function isAuthorized(req: NextRequest) {
    return req.headers.get('x-admin-token') === process.env.ADMIN_PASSWORD
}

export async function POST(req: NextRequest) {
    if (!isAuthorized(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const formData = await req.formData()
        const file = formData.get('file') as File
        const folder = (formData.get('folder') as string) || 'general'

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        // Validate file type
        if (!file.type.startsWith('image/') && !file.type.startsWith('audio/') && !file.type.startsWith('video/')) {
            return NextResponse.json({ error: 'Invalid file format. Received: ' + (file.type || 'unknown') }, { status: 400 })
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: 'File is too large. Maximum size is 10MB' }, { status: 400 })
        }

        // Generate a unique file name
        const ext = file.name.split('.').pop()
        const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

        const arrayBuffer = await file.arrayBuffer()
        const buffer = new Uint8Array(arrayBuffer)

        const { data, error } = await supabase.storage
            .from('diana-mae-assets')
            .upload(filename, buffer, {
                contentType: file.type,
                upsert: false,
            })

        if (error) {
            console.error('Storage upload error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Build the public URL
        const { data: urlData } = supabase.storage
            .from('diana-mae-assets')
            .getPublicUrl(data.path)

        return NextResponse.json({ url: urlData.publicUrl, path: data.path })
    } catch (err) {
        console.error('Upload handler error:', err)
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }
}
