'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError('')

        const res = await fetch('/api/admin/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        })
        const data = await res.json()

        if (res.ok) {
            sessionStorage.setItem('admin_token', data.token)
            router.push('/admin')
        } else {
            setError(data.error || 'Invalid password')
            setLoading(false)
        }
    }

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'radial-gradient(ellipse at 50% 30%, #1a0830 0%, #050508 100%)',
            }}
        >
            <div
                style={{
                    width: '100%',
                    maxWidth: 400,
                    padding: '48px 40px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(147,51,234,0.25)',
                    borderRadius: '24px',
                    backdropFilter: 'blur(20px)',
                }}
            >
                {/* Icon */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div
                        style={{
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #9333ea, #e040fb)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '28px',
                            margin: '0 auto 16px',
                            boxShadow: '0 0 30px rgba(147,51,234,0.4)',
                        }}
                    >
                        🔐
                    </div>
                    <h1
                        style={{
                            fontFamily: 'Georgia, serif',
                            fontSize: '1.8rem',
                            fontWeight: 400,
                            color: 'white',
                            marginBottom: '6px',
                        }}
                    >
                        <em>Diana Mae</em> Admin
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px' }}>
                        Enter your admin password to continue
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <input
                        type="password"
                        placeholder="Admin password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoFocus
                        style={{
                            width: '100%',
                            padding: '14px 18px',
                            background: 'rgba(255,255,255,0.07)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            borderRadius: '12px',
                            color: 'white',
                            fontSize: '15px',
                            outline: 'none',
                            boxSizing: 'border-box',
                            transition: 'border-color 0.3s ease',
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(147,51,234,0.6)')}
                        onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                    />

                    {error && (
                        <p
                            style={{
                                color: '#f43f5e',
                                fontSize: '14px',
                                background: 'rgba(244,63,94,0.08)',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                border: '1px solid rgba(244,63,94,0.2)',
                            }}
                        >
                            ⚠️ {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '14px',
                            background: loading
                                ? 'rgba(147,51,234,0.4)'
                                : 'linear-gradient(135deg, #9333ea, #e040fb)',
                            border: 'none',
                            borderRadius: '12px',
                            color: 'white',
                            fontSize: '15px',
                            fontWeight: 600,
                            cursor: loading ? 'wait' : 'pointer',
                            transition: 'all 0.3s ease',
                            letterSpacing: '0.04em',
                        }}
                    >
                        {loading ? 'Verifying...' : 'Enter Admin Panel'}
                    </button>
                </form>
            </div>
        </div>
    )
}
