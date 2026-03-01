import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    const { password } = await req.json()
    const adminPass = process.env.ADMIN_PASSWORD

    if (!adminPass) {
        return NextResponse.json({ error: 'Admin not configured' }, { status: 500 })
    }

    if (password === adminPass) {
        return NextResponse.json({ token: adminPass })
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
}
