'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function useAdminAuth() {
    const [token, setToken] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const stored = sessionStorage.getItem('admin_token')
        if (!stored) {
            router.push('/admin/login')
        } else {
            setToken(stored)
        }
        setLoading(false)
    }, [router])

    function logout() {
        sessionStorage.removeItem('admin_token')
        router.push('/admin/login')
    }

    return { token, loading, logout }
}
